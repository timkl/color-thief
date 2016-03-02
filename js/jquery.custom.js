$(document).ready(function() {
  var colorThief = new ColorThief();

  var showColorsForImage = function($image, $imageSection ) {
    var image                    = $image[0];
    var color                    = colorThief.getColor(image);

    var colorThiefOutput = {
      color: color,
    };

    var colorThiefOuputHTML = Mustache.to_html($('#color-thief-output-template').html(), colorThiefOutput);

    $imageSection.addClass('with-color-thief-output');

    var intialColor = 'rgb('+ colorThiefOutput.color[0]+','+ colorThiefOutput.color[1]+','+ colorThiefOutput.color[2]+')';

    var color = chroma(intialColor).darken(.2).hex();
    var colorDark = chroma(intialColor).darken(.75).hex();
	  var colorLight = chroma(intialColor).brighten(3.5).saturate(1.5).hex();

    console.log("color: " + color);
    console.log("colorDark: " + colorDark);
    console.log("colorLight: " + colorLight);

    $('body').css('background-color', color);
        $('body').css('color', colorLight);
    $('h1.organizer, h2.title, footer, .topbar span, .drop-zone.dragging, .drop-zone.dragging .drop-zone-label').css('color', colorLight);
    $('.topbar').css('background-color', colorDark);
    $(".dragged-images img").css('border-color', colorDark);
    $("button").css('background-color', colorLight);
    $("button").css('color', colorDark);
    $(".pictures div").css('border-color', colorDark);
    $(".dragged-images img").css('background-color', color);
    $("use.logotype").css("fill", colorLight);
    
    // Hack- hacky-hack-hack
    var imagePath = "url(" + $(".target-image").attr("src") +")";
    console.log(imagePath);
    $(".drop-zone").css("background-image", imagePath);
  };

    if (Modernizr.draganddrop && !!window.FileReader) {

      $('#drag-drop').show();
      var $dropZone = $('#drop-zone');
      var handleDragEnter = function(event){
        $dropZone.addClass('dragging');
        return false;
      };
      var handleDragLeave = function(event){
        $dropZone.removeClass('dragging');
        return false;
      };
      var handleDragOver = function(event){
        return false;
      };
      var handleDrop = function(event){
        $dropZone.removeClass('dragging');
        handleFiles(event.originalEvent.dataTransfer.files);
        return false;
      };
      $dropZone
        .on('dragenter', handleDragEnter)
        .on('dragleave', handleDragLeave)
        .on('dragover', handleDragOver)
        .on('drop', handleDrop);
    }

    function handleFiles(files) {
      var $draggedImages = $('#dragged-images');
      var imageType      = /image.*/;
      var fileCount      = files.length;

      for (var i = 0; i < fileCount; i++) {
        var file = files[i];

        if (file.type.match(imageType)) {
          var reader = new FileReader();
          reader.onload = function(event) {
              imageInfo = { images: [
                  {'class': 'dropped-image', file: event.target.result}
                ]};

              var imageSectionHTML = Mustache.to_html($('#image-section-template').html(), imageInfo);
              $draggedImages.prepend(imageSectionHTML);

              var $imageSection = $draggedImages.find('.image-section').first();
              var $image        = $('.dropped-image .target-image');

              $image.on('load', function() {
                console.log(file);
                showColorsForImage($image, $imageSection);
              });
            };
          reader.readAsDataURL(file);
        } else {
          alert('File must be a supported image type.');
        }
      }
    }

});
