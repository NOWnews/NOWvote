#!/bin/bash

sed -i "" "s/config.removeDialogTabs\ =\ 'image:advanced;link:advanced';/config.removeDialogTabs='image:advanced;link:advanced';config.image_previewText='\ \ ';config.filebrowserImageUploadUrl='\/ckeditor\/fileUpload';/" ./bower_components/ckeditor/config.js;
