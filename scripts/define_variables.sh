if [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then

    echo "VPS_HOST=${{ secrets.VPS_DEV_HOST }}" >> $GITHUB_ENV
    echo "VPS_PORT=2222" >> $GITHUB_ENV
    echo "VPS_USER=${{ secrets.VPS_DEV_USER }}" >> $GITHUB_ENV
    echo "SSH_PRIVATE_KEY<<EOF" >> $GITHUB_ENV
    echo "${{ secrets.SSH_DEV_PRIVATE_KEY }}" >> $GITHUB_ENV
    echo "EOF" >> $GITHUB_ENV
    echo "BRANCH=develop" >> $GITHUB_ENV
    echo "SUBDOMAIN=Host(\`gifto.local.sosthyone.fr\`)" >> $GITHUB_ENV

elif [[ "${{ github.ref }}" == "refs/heads/main" ]]; then

    echo "VPS_HOST=${{ secrets.VPS_PROD_HOST }}" >> $GITHUB_ENV
    echo "VPS_PORT=22" >> $GITHUB_ENV
    echo "VPS_USER=${{ secrets.VPS_PROD_USER }}" >> $GITHUB_ENV
    echo "SSH_PRIVATE_KEY<<EOF" >> $GITHUB_ENV
    echo "${{ secrets.SSH_PROD_PRIVATE_KEY }}" >> $GITHUB_ENV
    echo "EOF" >> $GITHUB_ENV
    echo "BRANCH=main" >> $GITHUB_ENV
    echo "SUBDOMAIN=Host(\`gifto.sosthyone.fr\`) || Host(\`gifto.sosthyone.com\`)" >> $GITHUB_ENV

else
    echo "No deployment for this event."
    exit 0
fi