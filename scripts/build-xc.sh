#!/bin/bash
set -e

rm -rf "BrownfieldApp.xcframework"

# OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
xcodebuild \
  -workspace "ios/expobrownfieldtest.xcworkspace" \
  -scheme "BrownfieldApp" \
  -derivedDataPath "ios/build" \
  -destination "generic/platform=iphoneos" \
  -destination "generic/platform=iphonesimulator" \
  -configuration "Release"

# TODO: Fix paths to build (ios/build)
xcodebuild \
  -create-xcframework \
  -framework "./ios/build/Build/Products/Release-iphoneos/BrownfieldApp.framework" \
  -framework "./ios/build/Build/Products/Release-iphonesimulator/BrownfieldApp.framework" \
  -output "BrownfieldApp.xcframework"
