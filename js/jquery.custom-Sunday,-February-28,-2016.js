$(document).ready(function() {
  var colorThief = new ColorThief();

function colorChange(){
  var $myImage = $("#coverImage");
  var cp = colorThief.getColor($myImage[0]);
  $('html').css('background-color', 'rgb('+cp[0]+','+cp[1]+','+cp[2]+')');
}
  colorChange();

  var showColorsForImage = function($image, $imageSection ) {
    var image                    = $image[0];
    var color                    = colorThief.getColor(image);
    var palette                  = colorThief.getPalette(image);

    var colorThiefOutput = {
      color: color,
      palette: palette,
    };
    var colorThiefOuputHTML = Mustache.to_html($('#color-thief-output-template').html(), colorThiefOutput);
    $imageSection.addClass('with-color-thief-output');


    $('html').css('background-color', 'rgb('+ colorThiefOutput.color[0]+','+ colorThiefOutput.color[1]+','+ colorThiefOutput.color[2]+')');

    setTimeout(function(){
      $imageSection.find('.color-thief-output').append(colorThiefOuputHTML).slideDown();
    }, 400);
    
  };

    if (Modernizr.draganddrop && !!window.FileReader && !isMobile()) {

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
                showColorsForImage($image, $imageSection);
                alert(colorThiefOutput.color);
              });
            };
          reader.readAsDataURL(file);
        } else {
          alert('File must be a supported image type.');
        }
      }
    }

    function isMobile(){
      var isMobile = (/iphone|ipod|ipad|android|ie|blackberry|fennec/).test
           (navigator.userAgent.toLowerCase());
      return isMobile;
  }

});
