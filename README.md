# serverless-automation-github

### Setup
Before diving in the actual code, you’ll have to set up your Serverless environment.
You first need to install Serverless as a global dependency:

```shell
npm install -g serverless
```
&&
```shell
npm install
```

Next, you’ll need to install the [AWS CLI tool](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), that will later be used by Serverless to manage all your resources.

Once installed, you’ll have to create an AWS user for Serverless and generate keys for it. Please refer to [this section](https://serverless.com/framework/docs/providers/aws/guide/credentials/#creating-aws-access-keys) of the official guide. 

Now that you have your keys, we can configure Serverless to access AWS on your behalf:

```shell
serverless configure credentials \
    --provider aws \
    --key <access-key-id> \
    --secret <secret-access-key> \
    --profile serverless-admin
```

This creates an ~/.aws/credentials file containing your keys under a profile named serverless-admin.

Also you should [generate a github token](https://github.com/settings/tokens/new?scopes=repo&description=serverless-automation-github), and place it into `env.json` which will be used by Octokit.

### Run

#### Run offline:

```shell
serverless offline start

curl -X POST http://localhost:3000/webhook
```

#### In the Cloud:

```shell
# Deploy all your stack
serverless deploy

# Deploy a single function (a lot faster)
serverless deploy --function hello

# Test it
curl -X POST https://<random-id>.execute-api.us-east-1.amazonaws.com/dev/webhook
```

Additionaly you will need to add webhook to your repository which can access to Issues section, and with payload URL of your running lambda instance.
