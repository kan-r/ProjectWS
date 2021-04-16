cd /data
echo "node version:"
node --version

echo "npm version:"
npm --version
rm -rf node_modules

echo "====================install dependencies===================="
npm install
rc=$?; if [ $rc != 0 ]; then exit $rc; fi

