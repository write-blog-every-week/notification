# notification

## setup

```
$ cp .env.example .env
```

## build

```
$ sam build
```

## deploy

```
$ sam deploy --guided --stack-name wbew --parameter-overrides $(cat .env)
```

## ローカルで遊びたいとき

### setup

```
$ pip install awscli-local
$ pip install aws-sam-cli-local
$ docker-compose up -d
```
