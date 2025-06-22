from django.db import models

# Create your models here.
class FaceUser(models.Model):
    name = models.CharField(max_length=100)
    face_image = models.ImageField(upload_to='faces/')
    face_encoding = models.BinaryField(null=True,blank=True)

    def __str__(self):
        return self.name
    
