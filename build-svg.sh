#!/bin/bash

for i in src/assets/svg/*.svg ; do
  out="atlas/src/$(basename $i .svg).png"

  if [ "$i" -nt "$out" ]; then
    inkscape --export-png=$out --export-dpi=96 --export-background-opacity=0 --without-gui $i
  fi
done

node tooling/build-atlas.js

