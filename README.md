# onedrive-cameraroll-renamer

Renames all the files in your OneDrive Camera Roll folder
into the format `YYYYMMDD_HHmmss`. 

*DISCLAIMER*: This is a tool I built for myself. It is not super extensive or configurable, it just gets the thing done for me. See [TODOs](#todos) for open things to improve. Feel free to contribute by creating issues or PRs here.

## Background

Phones store fotos and videos with different filenames.
Some store them like `YYYYMMDD_HHmmss.jpg`, some do `IMG_YYYYMMDD_HHmmss.jpg`
and others put the unix timestamp into the name (`IMG_1558292380001_12345.jpg`).

The OneDrive app automatically uploads the fotos and videos to your OneDrive
but keeps the filenames as-is. If the files in the folder do not have a consistent
naming scheme, looking through the files is annoying because you cannot sort them
chronologically.

This website connects to your OneDrive account (as soon as you authorize it) and
renames all files from `/Bilder/Camera Roll` and moves them to `/Bilder/Camera Roll/umbenannt`
for not having too process them twice.

## TODOs

* The list of filename patterns is not complete for sure. I just added the cases I encountered with my files
* The files are not really named with 100% consistency. The most important thing for me right now was that all files start with `YYYYMMDD_`
* The source folder and destination folder are currently hardcoded.
* It only processes the first 200 files. If there are more files, you need to re-run again by reloading the page.
* Errors are not really displayed in a way that makes it easy to understand the problem.
