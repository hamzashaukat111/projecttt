$(document).ready(function () {
  $("#uploadForm").submit(function (event) {
    event.preventDefault();
    var formData = new FormData();
    var fileInput = document.getElementById("imageInput");
    formData.append("image", fileInput.files[0]);

    $.ajax({
      url: "https://cvwatermark-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/734afe81-8fa0-45d9-8bc5-81d075b50746/classify/iterations/Iteration1/image",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "Prediction-Key": "5e19fdcca31a48878e82eb0b7b226244",
      },
      success: function (response) {
        var predictions = response.predictions;
        var resultContainer = document.getElementById("resultContainer");
        var resultHeading = document.getElementById("resultHeading");
        var uploadedImage = document.getElementById("uploadedImage");
        resultContainer.innerHTML = "";
        resultHeading.innerHTML = "";
        uploadedImage.style.display = "none";

        if (predictions.length > 0) {
          var watermarkProbability = 0;
          var noWatermarkProbability = 0;
          for (var i = 0; i < predictions.length; i++) {
            var prediction = predictions[i];
            if (prediction.tagName === "Watermark") {
              watermarkProbability = prediction.probability;
            } else if (prediction.tagName === "NoWatermark") {
              noWatermarkProbability = prediction.probability;
            }
          }

          var result = '<div class="result-container">';
          result += '<div class="prediction">';
          result += '<p class="tag-name">Watermark</p>';
          result += '<div class="percentage-bar">';
          result +=
            '<div class="percentage" style="width: ' +
            watermarkProbability * 100 +
            '%;"></div>';
          result += "</div>";
          result +=
            '<p class="probability">' +
            (watermarkProbability * 100).toFixed(2) +
            "%</p>";
          result += "</div>";

          result += '<div class="prediction">';
          result += '<p class="tag-name">No Watermark</p>';
          result += '<div class="percentage-bar">';
          result +=
            '<div class="percentage" style="width: ' +
            noWatermarkProbability * 100 +
            '%;"></div>';
          result += "</div>";
          result +=
            '<p class="probability">' +
            (noWatermarkProbability * 100).toFixed(2) +
            "%</p>";
          result += "</div>";
          result += "</div>";

          resultContainer.innerHTML = result;

          if (watermarkProbability > noWatermarkProbability) {
            resultHeading.innerHTML =
              '<h2 class="result-heading">This Image contains a watermark</h2>';
          } else {
            resultHeading.innerHTML =
              '<h2 class="result-heading">This Image does not contain a watermark</h2>';
          }
        } else {
          resultContainer.innerHTML = "<p>No predictions found.</p>";
        }

        var reader = new FileReader();
        reader.onload = function (e) {
          uploadedImage.src = e.target.result;
          uploadedImage.style.display = "block";
        };
        reader.readAsDataURL(fileInput.files[0]);
      },
      error: function () {
        var resultContainer = document.getElementById("resultContainer");
        var resultHeading = document.getElementById("resultHeading");
        resultContainer.innerHTML =
          "<p>An error occurred while processing the image.</p>";
        resultHeading.innerHTML = "";
      },
    });
  });
});
