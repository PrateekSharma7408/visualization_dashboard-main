from django.db import models
from datetime import datetime
from django.utils import timezone

class DataModel(models.Model):
    end_year = models.CharField(max_length=10, blank=True, null=True)
    intensity = models.IntegerField()
    sector = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    insight = models.CharField(max_length=255)
    url = models.URLField()
    region = models.CharField(max_length=255)
    start_year = models.CharField(max_length=10, blank=True, null=True)
    impact = models.CharField(max_length=255, blank=True, null=True)
    added = models.DateTimeField()
    published = models.DateTimeField(null=True, blank=True)
    country = models.CharField(max_length=255)
    relevance = models.IntegerField()
    pestle = models.CharField(max_length=255)
    source = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    likelihood = models.IntegerField()

    def save(self, *args, **kwargs):
        # Convert 'added' and 'published' to the correct format before saving
        self.added = self.convert_to_datetime(self.added)
        self.published = self.convert_to_datetime(self.published)
        
        # Handle intensity as an integer
        try:
            self.intensity = int(self.intensity)
        except (ValueError, TypeError):
            self.intensity = 0  # Set a default value or handle it in another way
        try:
            self.likelihood = int(self.likelihood)
        except (ValueError, TypeError):
            self.likelihood = 0  # Set a default value or handle it in another way
        try:
            self.relevance = int(self.relevance)
        except (ValueError, TypeError):
            self.relevance = 0  # Set a default value or handle it in another way
        
        super().save(*args, **kwargs)

    def convert_to_datetime(self, value):
        if not value:  # Check if the value is empty
            return None  # or return a default value if appropriate
        try:
            naive_datetime = datetime.strptime(value, "%B, %d %Y %H:%M:%S")
            aware_datetime = timezone.make_aware(naive_datetime, timezone.get_default_timezone())
            return aware_datetime
        except ValueError:
            # Handle the case where the conversion fails
            return None

    def __str__(self):
        return self.title
