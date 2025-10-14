FILE="\${SRCROOT}/Pods/Target Support Files/Pods-expobrownfieldtest-BrownfieldApp/ExpoModulesProvider.swift"
if [ -f "$FILE" ]; then
  echo "Patching $FILE to hide Expo from public interface"
  perl -pi -e 's/^import EX/internal import EX/g; s/^import Ex/internal import Ex/g; s/public class ExpoModulesProvider/internal class ExpoModulesProvider/g;' "$FILE"
fi
