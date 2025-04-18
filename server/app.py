from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import json
import traceback

app = Flask(__name__)
CORS(app)

# Load the trained model
try:
    model = load_model("model.h5")
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Failed to load model:", e)
    model = None

# Load disease metadata
try:
    with open("disease.json", "r") as f:
        disease_data = json.load(f)
    print("✅ disease.json loaded.")
except FileNotFoundError:
    disease_data = {}
    print("⚠️ disease.json not found. Using empty fallback.")

# Labels must match training data
class_names = [
    "Apple Scab", "Apple Black Rot", "Apple Cedar Rust", "Apple Healthy",
    "Blueberry Healthy", "Cherry Powdery Mildew", "Cherry Healthy",
    "Corn Cercospora Leaf Spot & Gray Leaf Spot", "Corn Common Rust",
    "Corn Northern Leaf Blight", "Corn Healthy", "Grape Black Rot",
    "Grape Esca (Black Measles)", "Grape Leaf Blight (Isariopsis Leaf Spot)",
    "Grape Healthy", "Orange Haunglongbing (Citrus Greening)",
    "Peach Bacterial Spot", "Peach Healthy", "Pepper Bell Bacterial Spot",
    "Pepper Bell Healthy", "Potato Early Blight", "Potato Late Blight",
    "Potato Healthy", "Raspberry Healthy", "Soybean Healthy",
    "Squash Powdery Mildew", "Strawberry Leaf Scorch", "Strawberry Healthy",
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight",
    "Tomato Leaf Mold", "Tomato Septoria Leaf Spot",
    "Tomato Spider Mites (Two-Spotted Spider Mite)", "Tomato Target Spot",
    "Tomato Yellow Leaf Curl Virus", "Tomato Mosaic Virus", "Tomato Healthy"
]

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not available"}), 500

    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Image processing
        img = Image.open(file)
        img = img.convert('RGB')
        img = img.resize((128, 128))
        img_array = np.array(img) 
        img_array = img_array.reshape(1, 128, 128, 3)

        print(f"📷 Image processed. Shape: {img_array.shape}")

        # Prediction
        prediction = model.predict(img_array)[0]
        print(f"📈 Prediction vector: {prediction}")

        class_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        if class_index >= len(class_names):
            return jsonify({"error": "Predicted class index out of range."}), 500

        class_name = class_names[class_index]
        print(f"✅ Predicted: {class_name} (Index: {class_index}, Confidence: {confidence:.4f})")

        # Lookup additional info
        disease_info = disease_data.get(class_name, {})

        return jsonify({
            "predicted_class": class_index,
            "disease_name": class_name,
            "confidence": f"{confidence:.4f}",
            "prediction_vector": prediction.tolist(),  # Optional: to analyze model certainty
            "cure": disease_info.get("cure", "Not available"),
            "precaution": disease_info.get("precaution", "Not available")
        })

    except Exception as e:
        print("❌ Error during prediction:\n", traceback.format_exc())
        return jsonify({"error": "Prediction failed. Check server logs."}), 500

if __name__ == '__main__':
    app.run(debug=True)
