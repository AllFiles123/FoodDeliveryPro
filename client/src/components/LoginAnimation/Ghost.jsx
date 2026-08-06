cd ~/storage/shared/Download/FoodDeliveryPro

find . \( -name "Ghost.jsx" -o -name "LoginAnimation.jsx" -o -name "LoginPage.jsx" -o -name "LoginAnimationContext.jsx" \) -exec sh -c '
for f do
  echo "=============================="
  echo "FILE: $f"
  echo "=============================="
  cat "$f"
  echo
done
