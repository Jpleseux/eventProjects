FROM python:3.10.2-slim

RUN useradd -ms /bin/bash python
WORKDIR /home/python/app

RUN apt-get update && apt-get install -y xsel xclip

RUN pip install --upgrade pip

RUN pip install pyperclip

ENV PYTHONPATH=${PYTHONPATH}/home/python/app

CMD ["tail", "-f", "/dev/null"]
