from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import FaceUser
from .serializers import FaceUserSerializer
import mediapipe as mp
import numpy as np
import cv2
import os

@api_view(['POST'])
def signup_face(req):
    serializer = FaceUserSerializer(data=req.data)
    if serializer.is_valid():
        instance = serializer.save()
        image_path = instance.face_image.path

        # Load image
        image_bgr = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

        # Setup MediaPipe
        mp_face_mesh = mp.solutions.face_mesh
        with mp_face_mesh.FaceMesh(static_image_mode=True,
                                   max_num_faces=1,
                                   refine_landmarks=True,
                                   min_detection_confidence=0.5) as face_mesh:

            results = face_mesh.process(image_rgb)

            if results.multi_face_landmarks:
                height, width, _ = image_bgr.shape
                for face_landmarks in results.multi_face_landmarks:
                    # Eyes
                    for idx in list(mp_face_mesh.FACEMESH_LEFT_EYE) + list(mp_face_mesh.FACEMESH_RIGHT_EYE):
                        x = int(face_landmarks.landmark[idx[0]].x * width)
                        y = int(face_landmarks.landmark[idx[0]].y * height)
                        cv2.circle(image_bgr, (x, y), 2, (255, 255, 255), -1)

                    # Nose bridge
                    nose_bridge_indices = [6, 197, 195, 5, 4]
                    nose_points = [(int(face_landmarks.landmark[i].x * width),
                                    int(face_landmarks.landmark[i].y * height)) for i in nose_bridge_indices]
                    for i in range(len(nose_points) - 1):
                        cv2.line(image_bgr, nose_points[i], nose_points[i + 1], (255, 255, 255), 2)

                # Save the image
                drawn_path = os.path.splitext(image_path)[0] + "_drawn.jpg"
                cv2.imwrite(drawn_path, image_bgr)

                return Response({
                    "message": "Signup successful with face and landmarks drawn!",
                    "image_with_landmarks": drawn_path
                }, status=status.HTTP_201_CREATED)
            else:
                instance.delete()
                return Response({"error": "No face detected in image."}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
