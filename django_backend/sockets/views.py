from django.shortcuts import render

from django.http import HttpResponse

from channels import Group

def publish(request):
    msg = request.GET.get('msg', 'null')
    Group("sample").send({"text": msg})
    return HttpResponse("Published!")
