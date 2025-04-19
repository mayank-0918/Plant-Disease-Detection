from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import json
import os
import traceback

# Initialize Flask app
app = Flask(__name__, static_folder="client/dist", static_url_path="")
CORS(app)

# Load model
try:
    model = load_model("model.h5")
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Failed to load model:", e)
    model = None

# Load disease info
try:
    with open("disease.json", "r") as f:
        disease_data = json.load(f)
    print("✅ disease.json loaded.")
except FileNotFoundError:
    disease_data = {}
    print("⚠️ disease.json not found. Using empty dictionary.")

# Define class names (make sure these are in same order as your model output)
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

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not available"}), 500

    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # Preprocess the image
        img = Image.open(file).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.array(img).reshape(1, 128, 128, 3)

        # Make prediction
        prediction = model.predict(img_array)[0]
        class_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        if class_index >= len(class_names):
            return jsonify({"error": "Invalid class index"}), 500

        class_name = class_names[class_index]
        disease_info = disease_data.get(class_name, {})

        print(f"✅ Prediction: {class_name} | Confidence: {confidence:.4f}")

        return jsonify({
            "predicted_class": class_index,
            "disease_name": class_name,
            "confidence": f"{confidence:.4f}",
            "prediction_vector": prediction.tolist(),
            "cure": disease_info.get("cure", "Not available"),
            "precaution": disease_info.get("precaution", "Not available")
        })

    except Exception as e:
        print("❌ Prediction error:\n", traceback.format_exc())
        return jsonify({"error": "Prediction failed"}), 500

# Serve React frontend
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_react_app(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        # Fallback to index.html for React Router
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
