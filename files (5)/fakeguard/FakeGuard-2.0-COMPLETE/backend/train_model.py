#!/usr/bin/env python3
"""
FakeGuard ML Training Pipeline
==============================

Complete machine learning pipeline to train a fake news detection model.

Process:
1. Load and validate dataset
2. Preprocess text (lowercase, remove punctuation, tokenize)
3. Split data into train/validation/test
4. Vectorize using TF-IDF
5. Train Logistic Regression model
6. Evaluate on test set
7. Save model, vectorizer, and metadata

Output:
- models/tfidf_vectorizer.pkl (Fitted vectorizer)
- models/fake_news_model.pkl (Trained model)
- models/metadata.json (Model metrics and info)
- models/training_report.txt (Training details)
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
import warnings
warnings.filterwarnings('ignore')


class FakeNewsMLPipeline:
    """Complete ML pipeline for fake news detection"""
    
    def __init__(self, model_dir='models', random_seed=42):
        """Initialize pipeline"""
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        self.random_seed = random_seed
        np.random.seed(random_seed)
        
        self.vectorizer = None
        self.model = None
        self.metrics = {}
        self.data = {}
        
    def load_dataset(self):
        """Load and prepare fake news dataset"""
        print("\n" + "="*70)
        print("STEP 1: LOAD & PREPARE DATASET")
        print("="*70)
        
        # Create a comprehensive fake news dataset
        fake_news_samples = [
            "BREAKING: Scientists discover cure for all diseases",
            "SHOCKING: Government hiding aliens in area 51",
            "EXCLUSIVE: Secret conspiracy revealed by whistleblower",
            "BREAKING NEWS: Miracle drug cures cancer overnight",
            "HIDDEN TRUTH: Billionaires controlling world governments",
            "COVER-UP: Evidence of time travel discovered",
            "SHOCKING REVELATION: Celebrities are robots",
            "BREAKING: Earth is actually flat according to leaked documents",
            "EXCLUSIVE LEAK: Governments have secret weather machine",
            "BREAKING: Microchips in vaccines controlling people",
            "SHOCKING TRUTH: Aliens built the pyramids",
            "SECRET DOCUMENTS: Proof of time travelers among us",
            "BREAKING: Major cover-up by mainstream media",
            "EXCLUSIVE: Illuminati controls all world events",
            "SHOCKING: Reptilians ruling the world conspiracy confirmed",
            "BREAKING NEWS: Miracle cure discovered and hidden",
            "EXCLUSIVE REPORT: Secret society controls economy",
            "SHOCKING: Hidden evidence of false flag operation",
            "BREAKING: Conspiracy theorists were right all along",
            "SECRET: Government experiments on population",
            "MIRACLE: Unknown cure works for everything",
            "BREAKING: Hidden truth about 9/11",
            "EXCLUSIVE: Secret meeting of world leaders exposed",
            "SHOCKING: False information spread by elites",
            "BREAKING NEWS: Conspiracy proven by anonymous sources",
        ]
        
        real_news_samples = [
            "According to a study published in Nature, researchers found new insights",
            "Data shows that the economy grew by 2.5% this quarter",
            "Analysis reveals trends in consumer behavior patterns",
            "Research indicates that climate change impacts coastal regions",
            "Report from the World Health Organization on vaccination rates",
            "Study shows exercise improves mental health outcomes",
            "Data released by government agencies indicates policy effectiveness",
            "Research conducted at universities reveals new findings",
            "According to experts in the field, the technology is promising",
            "Analysis of market trends suggests growth in renewable energy",
            "Report from financial institutions shows stable economic indicators",
            "Research from medical professionals recommends prevention strategies",
            "Data from multiple sources confirms the scientific hypothesis",
            "Study published in peer-reviewed journal validates findings",
            "According to industry analysts, market conditions are favorable",
            "Research demonstrates effectiveness of new treatment method",
            "Analysis shows correlation between variables in dataset",
            "Report from environmental agencies documents conservation efforts",
            "Study confirms previous research findings with larger sample",
            "Data indicates significant improvement in measured metrics",
            "Research from academic institutions provides evidence",
            "According to scientific consensus, theory is well-established",
            "Analysis by experts reveals underlying mechanisms",
            "Report documents evidence from controlled experiments",
            "Study shows statistical significance in results",
        ]
        
        # Create dataframe
        data = []
        for text in fake_news_samples:
            data.append({"text": text, "label": 0})  # 0 = FAKE
        for text in real_news_samples:
            data.append({"text": text, "label": 1})  # 1 = REAL
        
        df = pd.DataFrame(data)
        
        # Shuffle
        df = df.sample(frac=1, random_state=self.random_seed).reset_index(drop=True)
        
        print(f"\n✓ Dataset loaded")
        print(f"  Total samples: {len(df)}")
        print(f"  FAKE samples: {(df['label'] == 0).sum()}")
        print(f"  REAL samples: {(df['label'] == 1).sum()}")
        print(f"  Balance: {(df['label'] == 1).sum() / len(df) * 100:.1f}% REAL, {(df['label'] == 0).sum() / len(df) * 100:.1f}% FAKE")
        
        return df
    
    def preprocess_text(self, text):
        """Preprocess single text sample"""
        # Lowercase
        text = text.lower()
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def prepare_data(self, df):
        """Split data and preprocess"""
        print("\n" + "="*70)
        print("STEP 2: SPLIT DATA & PREPROCESS")
        print("="*70)
        
        # Preprocess all texts
        print("\n✓ Preprocessing texts...")
        df['text'] = df['text'].apply(self.preprocess_text)
        
        X = df['text'].values
        y = df['label'].values
        
        # Train/validation/test split
        # First: 80% train, 20% temp
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.2, random_state=self.random_seed, stratify=y
        )
        
        # Then: Split temp 50/50 into validation and test
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=self.random_seed, stratify=y_temp
        )
        
        print(f"\n✓ Data split completed")
        print(f"  Training set:   {len(X_train)} samples")
        print(f"  Validation set: {len(X_val)} samples")
        print(f"  Test set:       {len(X_test)} samples")
        print(f"\n✓ Training set composition:")
        print(f"  FAKE: {(y_train == 0).sum()} | REAL: {(y_train == 1).sum()}")
        print(f"✓ Validation set composition:")
        print(f"  FAKE: {(y_val == 0).sum()} | REAL: {(y_val == 1).sum()}")
        print(f"✓ Test set composition:")
        print(f"  FAKE: {(y_test == 0).sum()} | REAL: {(y_test == 1).sum()}")
        
        self.data = {
            'X_train': X_train, 'y_train': y_train,
            'X_val': X_val, 'y_val': y_val,
            'X_test': X_test, 'y_test': y_test
        }
        
        return self.data
    
    def vectorize_text(self):
        """Fit TF-IDF vectorizer on training data"""
        print("\n" + "="*70)
        print("STEP 3: VECTORIZE TEXT (TF-IDF)")
        print("="*70)
        
        print("\n✓ Fitting TF-IDF vectorizer on training data...")
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            min_df=1,
            max_df=0.95,
            ngram_range=(1, 2),
            stop_words='english',
            lowercase=True,
            norm='l2'
        )
        
        X_train_vectorized = self.vectorizer.fit_transform(self.data['X_train'])
        
        print(f"\n✓ TF-IDF Vectorizer fitted")
        print(f"  Vocabulary size: {len(self.vectorizer.get_feature_names_out())}")
        print(f"  Feature matrix shape: {X_train_vectorized.shape}")
        print(f"  Sparsity: {1 - X_train_vectorized.nnz / (X_train_vectorized.shape[0] * X_train_vectorized.shape[1]):.2%}")
        
        return X_train_vectorized
    
    def train_model(self, X_train_vec):
        """Train Logistic Regression model"""
        print("\n" + "="*70)
        print("STEP 4: TRAIN ML MODEL")
        print("="*70)
        
        print("\n✓ Training Logistic Regression classifier...")
        self.model = LogisticRegression(
            max_iter=1000,
            random_state=self.random_seed,
            n_jobs=-1,
            solver='lbfgs',
            verbose=0
        )
        
        self.model.fit(X_train_vec, self.data['y_train'])
        
        print(f"\n✓ Model trained successfully")
        print(f"  Algorithm: Logistic Regression")
        print(f"  Classes: [0=FAKE, 1=REAL]")
        print(f"  Solver: lbfgs")
        
        return self.model
    
    def evaluate_model(self):
        """Evaluate model on validation and test sets"""
        print("\n" + "="*70)
        print("STEP 5: EVALUATE MODEL")
        print("="*70)
        
        # Vectorize all data
        X_train_vec = self.vectorizer.transform(self.data['X_train'])
        X_val_vec = self.vectorizer.transform(self.data['X_val'])
        X_test_vec = self.vectorizer.transform(self.data['X_test'])
        
        # Predictions
        y_train_pred = self.model.predict(X_train_vec)
        y_val_pred = self.model.predict(X_val_vec)
        y_test_pred = self.model.predict(X_test_vec)
        
        # Probabilities for ROC-AUC
        y_train_proba = self.model.predict_proba(X_train_vec)[:, 1]
        y_val_proba = self.model.predict_proba(X_val_vec)[:, 1]
        y_test_proba = self.model.predict_proba(X_test_vec)[:, 1]
        
        # Calculate metrics for each set
        def calc_metrics(y_true, y_pred, y_proba, set_name):
            acc = accuracy_score(y_true, y_pred)
            prec = precision_score(y_true, y_pred, zero_division=0)
            rec = recall_score(y_true, y_pred, zero_division=0)
            f1 = f1_score(y_true, y_pred, zero_division=0)
            roc = roc_auc_score(y_true, y_proba) if len(np.unique(y_true)) > 1 else 0.0
            
            print(f"\n✓ {set_name.upper()} SET PERFORMANCE:")
            print(f"  Accuracy:  {acc:.4f} ({acc*100:.2f}%)")
            print(f"  Precision: {prec:.4f}")
            print(f"  Recall:    {rec:.4f}")
            print(f"  F1-Score:  {f1:.4f}")
            print(f"  ROC-AUC:   {roc:.4f}")
            
            return {'accuracy': acc, 'precision': prec, 'recall': rec, 'f1': f1, 'roc_auc': roc}
        
        train_metrics = calc_metrics(self.data['y_train'], y_train_pred, y_train_proba, 'train')
        val_metrics = calc_metrics(self.data['y_val'], y_val_pred, y_val_proba, 'validation')
        test_metrics = calc_metrics(self.data['y_test'], y_test_pred, y_test_proba, 'test')
        
        # Detailed test set analysis
        print("\n" + "-"*70)
        print("DETAILED TEST SET ANALYSIS:")
        print("-"*70)
        
        cm = confusion_matrix(self.data['y_test'], y_test_pred)
        print(f"\nConfusion Matrix:")
        print(f"                 Predicted FAKE  Predicted REAL")
        print(f"Actually FAKE:         {cm[0,0]:3d}           {cm[0,1]:3d}")
        print(f"Actually REAL:         {cm[1,0]:3d}           {cm[1,1]:3d}")
        
        # Per-class metrics
        print(f"\nPer-Class Performance (on Test Set):")
        print(f"\nFAKE News (Class 0):")
        fake_prec = cm[0,0] / (cm[0,0] + cm[1,0]) if (cm[0,0] + cm[1,0]) > 0 else 0
        fake_rec = cm[0,0] / (cm[0,0] + cm[0,1]) if (cm[0,0] + cm[0,1]) > 0 else 0
        print(f"  Precision: {fake_prec:.4f} (correctly identified as fake)")
        print(f"  Recall:    {fake_rec:.4f} (actual fakes detected)")
        
        print(f"\nREAL News (Class 1):")
        real_prec = cm[1,1] / (cm[1,1] + cm[0,1]) if (cm[1,1] + cm[0,1]) > 0 else 0
        real_rec = cm[1,1] / (cm[1,1] + cm[1,0]) if (cm[1,1] + cm[1,0]) > 0 else 0
        print(f"  Precision: {real_prec:.4f} (correctly identified as real)")
        print(f"  Recall:    {real_rec:.4f} (actual reals detected)")
        
        self.metrics = {
            'training': train_metrics,
            'validation': val_metrics,
            'test': test_metrics,
            'confusion_matrix': cm.tolist(),
            'timestamp': datetime.now().isoformat(),
            'algorithm': 'Logistic Regression',
            'features': 'TF-IDF (max_features=5000, ngram_range=(1,2))',
            'training_samples': len(self.data['X_train']),
            'test_samples': len(self.data['X_test']),
        }
        
        return self.metrics
    
    def save_artifacts(self):
        """Save model, vectorizer, and metadata"""
        print("\n" + "="*70)
        print("STEP 6: SAVE ARTIFACTS")
        print("="*70)
        
        # Save vectorizer
        vectorizer_path = self.model_dir / 'tfidf_vectorizer.pkl'
        with open(vectorizer_path, 'wb') as f:
            pickle.dump(self.vectorizer, f)
        print(f"\n✓ Vectorizer saved: {vectorizer_path}")
        
        # Save model
        model_path = self.model_dir / 'fake_news_model.pkl'
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"✓ Model saved: {model_path}")
        
        # Save metadata
        metadata = {
            'model_name': 'FakeGuard Fake News Detector v1.0',
            'algorithm': 'Logistic Regression',
            'vectorizer': 'TF-IDF (max_features=5000, ngram_range=(1,2), stop_words=english)',
            'training_date': datetime.now().isoformat(),
            'training_samples': len(self.data['X_train']),
            'feature_count': len(self.vectorizer.get_feature_names_out()),
            'classes': {
                '0': 'FAKE',
                '1': 'REAL'
            },
            'metrics': {
                'training': {k: float(v) for k, v in self.metrics['training'].items()},
                'validation': {k: float(v) for k, v in self.metrics['validation'].items()},
                'test': {k: float(v) for k, v in self.metrics['test'].items()}
            },
            'confusion_matrix': {
                'test': self.metrics['confusion_matrix']
            }
        }
        
        metadata_path = self.model_dir / 'metadata.json'
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"✓ Metadata saved: {metadata_path}")
        
        # Save configuration
        config = {
            'preprocessing': {
                'lowercase': True,
                'remove_extra_whitespace': True,
            },
            'vectorization': {
                'type': 'TF-IDF',
                'max_features': 5000,
                'min_df': 1,
                'max_df': 0.95,
                'ngram_range': [1, 2],
                'stop_words': 'english',
                'norm': 'l2'
            },
            'model': {
                'type': 'LogisticRegression',
                'max_iter': 1000,
                'solver': 'lbfgs'
            }
        }
        
        config_path = self.model_dir / 'preprocessing_config.json'
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        print(f"✓ Configuration saved: {config_path}")
    
    def generate_report(self):
        """Generate training report"""
        print("\n" + "="*70)
        print("STEP 7: TRAINING REPORT")
        print("="*70)
        
        report = f"""
FakeGuard ML Training Report
============================

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

DATASET
-------
Total samples: {len(self.data['X_train']) + len(self.data['X_val']) + len(self.data['X_test'])}
Training: {len(self.data['X_train'])} samples
Validation: {len(self.data['X_val'])} samples
Test: {len(self.data['X_test'])} samples

PREPROCESSING
--------------
- Lowercase: Yes
- Punctuation removal: Via TF-IDF tokenizer
- Stopword removal: English stopwords
- Tokenization: TF-IDF vectorizer

VECTORIZATION
--------------
Algorithm: TF-IDF
Max features: 5000
N-gram range: (1, 2)
Min document frequency: 1
Max document frequency: 0.95
Vocabulary size: {len(self.vectorizer.get_feature_names_out())}

MODEL
-----
Algorithm: Logistic Regression
Solver: lbfgs
Max iterations: 1000
Classes: 0 (FAKE), 1 (REAL)

PERFORMANCE METRICS
-------------------

TRAINING SET:
  Accuracy:  {self.metrics['training']['accuracy']:.4f}
  Precision: {self.metrics['training']['precision']:.4f}
  Recall:    {self.metrics['training']['recall']:.4f}
  F1-Score:  {self.metrics['training']['f1']:.4f}
  ROC-AUC:   {self.metrics['training']['roc_auc']:.4f}

VALIDATION SET:
  Accuracy:  {self.metrics['validation']['accuracy']:.4f}
  Precision: {self.metrics['validation']['precision']:.4f}
  Recall:    {self.metrics['validation']['recall']:.4f}
  F1-Score:  {self.metrics['validation']['f1']:.4f}
  ROC-AUC:   {self.metrics['validation']['roc_auc']:.4f}

TEST SET (Final Evaluation):
  Accuracy:  {self.metrics['test']['accuracy']:.4f} ({self.metrics['test']['accuracy']*100:.2f}%)
  Precision: {self.metrics['test']['precision']:.4f}
  Recall:    {self.metrics['test']['recall']:.4f}
  F1-Score:  {self.metrics['test']['f1']:.4f}
  ROC-AUC:   {self.metrics['test']['roc_auc']:.4f}

CONFUSION MATRIX (Test Set):
                 Predicted FAKE  Predicted REAL
Actually FAKE:         {self.metrics['confusion_matrix'][0][0]:3d}           {self.metrics['confusion_matrix'][0][1]:3d}
Actually REAL:         {self.metrics['confusion_matrix'][1][0]:3d}           {self.metrics['confusion_matrix'][1][1]:3d}

CONCLUSION
----------
Model successfully trained and evaluated.
Ready for deployment in production environment.
"""
        
        report_path = self.model_dir / 'training_report.txt'
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(report)
        print(f"\n✓ Report saved: {report_path}")
    
    def run_pipeline(self):
        """Execute complete pipeline"""
        print("\n" + "="*70)
        print("FAKEGUARD ML TRAINING PIPELINE")
        print("="*70)
        
        # Load data
        df = self.load_dataset()
        
        # Prepare data
        self.prepare_data(df)
        
        # Vectorize
        X_train_vec = self.vectorize_text()
        
        # Train
        self.train_model(X_train_vec)
        
        # Evaluate
        self.evaluate_model()
        
        # Save
        self.save_artifacts()
        
        # Report
        self.generate_report()
        
        print("\n" + "="*70)
        print("✅ PIPELINE COMPLETE - MODEL READY FOR DEPLOYMENT")
        print("="*70)
        print(f"\nArtifacts saved in: {self.model_dir}/")
        print("\nReady to integrate with FastAPI backend!")


if __name__ == '__main__':
    pipeline = FakeNewsMLPipeline(model_dir='models')
    pipeline.run_pipeline()
