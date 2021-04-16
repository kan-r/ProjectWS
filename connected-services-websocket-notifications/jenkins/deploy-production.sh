cd /data
echo "node version:"
node --version

echo "npm version:"
npm --version

echo "====================install dependencies===================="
npm install
rc=$?; if [ $rc != 0 ]; then exit $rc; fi

echo "====================install sls ===================="
npm install -g serverless
rc=$?; if [ $rc != 0 ]; then exit $rc; fi

echo "====================install serverless-domain-manager ===================="
# note the absence of the "-g" flag: this is intended; otherwise, it does not work
npm install serverless-domain-manager --save-dev
rc=$?; if [ $rc != 0 ]; then exit $rc; fi

#echo "====================package===================="
#sls package
#rc=$?; if [ $rc != 0 ]; then exit $rc; fi

echo "==================== deploy ===================="
sls deploy --region $AWS_REGION --stage $LAMBDA_ENV --force
rc=$?; if [ $rc != 0 ]; then exit $rc; fi
