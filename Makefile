rabbit-run:
	docker run --name some-rabbit -p 5672:5672 -p 8080:15672 -d rabbitmq:3-management

rabbit-status:
	docker exec some-rabbit rabbitmqctl status

rabbit-stop:
	docker stop some-rabbit

rabbit-start:
	docker start some-rabbit

rabbir-execute:
	docker exec some-rabbit rabbitmqctl