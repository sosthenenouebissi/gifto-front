rm -rf $DEPLOY_PATH
echo "Cloning repository into $DEPLOY_PATH"
git clone -b "$BRANCH" git@github.com:sosthenenouebissi/gifto-front.git "$DEPLOY_PATH"
cd $DEPLOY_PATH
sed -i "s|{{SUBDOMAIN}}|$SUBDOMAIN|g" docker-compose.yml
docker compose down
docker compose up -d --build