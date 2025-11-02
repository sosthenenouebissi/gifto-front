mkdir -p $DEPLOY_PATH
cd $DEPLOY_PATH
if [ ! -d ".git" ]; then
    echo "Cloning repository into $DEPLOY_PATH"
    git clone -b "$BRANCH" git@github.com:sosthenenouebissi/gifto-front.git .
else
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
fi
docker compose down
docker compose up -d --build