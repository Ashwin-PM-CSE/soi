#!/usr/bin/env python3
"""
FakeGuard Backend API
=====================

FastAPI-based REST API for fake news detection using trained ML model.

Endpoints:
- GET /                    - API information
- GET /api/health         - Health check
- POST /api/predict       - Predict if news is fake or real
- GET /api/stats          - System statistics
- GET /api/model-info     - Model metadata and performance
- GET /api/metrics        - Model evaluation metrics

Author: FakeGuard ML Team
Version: 1.0.0
"""

import os
import json
import pickle
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# ============================================================================
# GLOBAL VARIABLES
# ============================================================================

# Startup time for uptime calculation
STARTUP_TIME = time.time()

# Model and vectorizer (loaded on startup)
MODEL = None
VECTORIZER = None
MODEL_METADATA = None
PREPROCESSING_CONFIG = None

# Statistics
PREDICTION_COUNT = 0
ERROR_COUNT = 0

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class PredictRequest(BaseModel):
    """Request schema for prediction endpoint"""
    text: str = Field(
        ...,
        min_length=20,
        max_length=5000,
        description="News article text to analyze (20-5000 characters)"
    )


class PredictResponse(BaseModel):
    """Response schema for prediction endpoint"""
    prediction: str = Field(description="REAL or FAKE")
    confidence: float = Field(description="Confidence score (0-100)")
    probability_fake: float = Field(description="Probability of being fake (0-1)")
    probability_real: float = Field(description="Probability of being real (0-1)")
    timestamp: str = Field(description="ISO timestamp of prediction")


class HealthResponse(BaseModel):
    """Response schema for health check"""
    status: str
    timestamp: str
    model_loaded: bool
    uptime_seconds: float


class StatsResponse(BaseModel):
    """Response schema for statistics"""
    total_predictions: int
    total_errors: int
    uptime_seconds: float
    model_version: str


class ModelInfoResponse(BaseModel):
    """Response schema for model information"""
    model_name: str
    algorithm: str
    vectorizer: str
    training_samples: int
    feature_count: int
    classes: dict
    training_date: str


class MetricsResponse(BaseModel):
    """Response schema for metrics"""
    test_accuracy: float
    test_precision: float
    test_recall: float
    test_f1_score: float
    test_roc_auc: float
    confusion_matrix: list


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="FakeGuard API",
    description="AI-powered fake news detection REST API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# STARTUP/SHUTDOWN FUNCTIONS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Load model and vectorizer on startup"""
    global MODEL, VECTORIZER, MODEL_METADATA, PREPROCESSING_CONFIG
    
    try:
        model_dir = Path(__file__).parent / 'models'
        
        # Load vectorizer
        vectorizer_path = model_dir / 'tfidf_vectorizer.pkl'
        with open(vectorizer_path, 'rb') as f:
            VECTORIZER = pickle.load(f)
        print(f"✓ Vectorizer loaded from {vectorizer_path}")
        
        # Load model
        model_path = model_dir / 'fake_news_model.pkl'
        with open(model_path, 'rb') as f:
            MODEL = pickle.load(f)
        print(f"✓ Model loaded from {model_path}")
        
        # Load metadata
        metadata_path = model_dir / 'metadata.json'
        with open(metadata_path, 'r') as f:
            MODEL_METADATA = json.load(f)
        print(f"✓ Metadata loaded from {metadata_path}")
        
        # Load preprocessing config
        config_path = model_dir / 'preprocessing_config.json'
        with open(config_path, 'r') as f:
            PREPROCESSING_CONFIG = json.load(f)
        print(f"✓ Preprocessing config loaded from {config_path}")
        
        print("\n✅ All models loaded successfully!")
        
    except FileNotFoundError as e:
        print(f"\n❌ ERROR: Could not find model file: {e}")
        print("Make sure you have run: python train_model.py")
        raise
    except Exception as e:
        print(f"\n❌ ERROR loading models: {e}")
        raise


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def preprocess_text(text: str) -> str:
    """Preprocess input text (must match training preprocessing)"""
    # Lowercase
    text = text.lower()
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text


def predict_news(text: str) -> dict:
    """Make prediction on news text"""
    global MODEL, VECTORIZER, PREDICTION_COUNT, ERROR_COUNT
    
    try:
        # Preprocess text
        processed_text = preprocess_text(text)
        
        # Vectorize using saved vectorizer (don't fit new one!)
        X = VECTORIZER.transform([processed_text])
        
        # Make prediction
        prediction = MODEL.predict(X)[0]
        probabilities = MODEL.predict_proba(X)[0]
        
        # Probabilities for both classes
        prob_fake = float(probabilities[0])  # Class 0 = FAKE
        prob_real = float(probabilities[1])  # Class 1 = REAL
        
        # Determine prediction
        pred_label = "FAKE" if prediction == 0 else "REAL"
        confidence = max(prob_fake, prob_real) * 100
        
        # Increment counter
        PREDICTION_COUNT += 1
        
        return {
            "prediction": pred_label,
            "confidence": round(confidence, 2),
            "probability_fake": round(prob_fake, 4),
            "probability_real": round(prob_real, 4),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        ERROR_COUNT += 1
        print(f"❌ Prediction error: {e}")
        raise


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """Root endpoint - API information"""
    return {
        "title": "FakeGuard API",
        "version": "1.0.0",
        "description": "AI-powered fake news detection REST API",
        "endpoints": {
            "health": "GET /api/health",
            "predict": "POST /api/predict",
            "stats": "GET /api/stats",
            "model_info": "GET /api/model-info",
            "metrics": "GET /api/metrics"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    uptime = time.time() - STARTUP_TIME
    
    return {
        "status": "healthy" if MODEL is not None else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": MODEL is not None,
        "uptime_seconds": round(uptime, 2)
    }


@app.post("/api/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(request: PredictRequest):
    """
    Predict whether news is fake or real
    
    Input: News article text (20-5000 characters)
    Output: FAKE/REAL with confidence score
    """
    try:
        if MODEL is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        result = predict_news(request.text)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats", response_model=StatsResponse, tags=["Statistics"])
async def get_stats():
    """Get system statistics"""
    uptime = time.time() - STARTUP_TIME
    
    return {
        "total_predictions": PREDICTION_COUNT,
        "total_errors": ERROR_COUNT,
        "uptime_seconds": round(uptime, 2),
        "model_version": MODEL_METADATA.get("training_date", "unknown") if MODEL_METADATA else "unknown"
    }


@app.get("/api/model-info", response_model=ModelInfoResponse, tags=["Model"])
async def get_model_info():
    """Get model metadata and information"""
    if MODEL_METADATA is None:
        raise HTTPException(status_code=503, detail="Model metadata not available")
    
    return {
        "model_name": MODEL_METADATA.get("model_name", "Unknown"),
        "algorithm": MODEL_METADATA.get("algorithm", "Unknown"),
        "vectorizer": MODEL_METADATA.get("vectorizer", "Unknown"),
        "training_samples": MODEL_METADATA.get("training_samples", 0),
        "feature_count": MODEL_METADATA.get("feature_count", 0),
        "classes": MODEL_METADATA.get("classes", {"0": "FAKE", "1": "REAL"}),
        "training_date": MODEL_METADATA.get("training_date", "Unknown")
    }


@app.get("/api/metrics", response_model=MetricsResponse, tags=["Model"])
async def get_metrics():
    """Get model evaluation metrics"""
    if MODEL_METADATA is None:
        raise HTTPException(status_code=503, detail="Model metrics not available")
    
    test_metrics = MODEL_METADATA.get("metrics", {}).get("test", {})
    confusion_matrix = MODEL_METADATA.get("confusion_matrix", {}).get("test", [[0, 0], [0, 0]])
    
    return {
        "test_accuracy": float(test_metrics.get("accuracy", 0)),
        "test_precision": float(test_metrics.get("precision", 0)),
        "test_recall": float(test_metrics.get("recall", 0)),
        "test_f1_score": float(test_metrics.get("f1", 0)),
        "test_roc_auc": float(test_metrics.get("roc_auc", 0)),
        "confusion_matrix": confusion_matrix
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return {
        "error": str(exc),
        "timestamp": datetime.now().isoformat()
    }


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
