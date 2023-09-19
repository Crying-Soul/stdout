from python:latest

env test=test

copy ./script.py /root/script.py

CMD [ "python", "/root/script.py" ]