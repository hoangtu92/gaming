<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.util.*"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>ROOT</title>
</head>
<body>

<%
String str = "<br>";

String rip = request.getRemoteAddr();
str += "RemoteAddr=" + rip + "<br>";
rip = request.getHeader("X-Real-IP");
str += "X-Real-IP=" + rip + "<br>";
rip = request.getHeader("CF-Connecting-IP");
str += "CF-Connecting-IP=" + rip + "<br>";
rip = request.getHeader("X-Forwarded-For");
str += "X-Forwarded-For=" + rip + "<br>";
rip = request.getHeader("Proxy-Client-IP");
str += "Proxy-Client-IP=" + rip + "<br>";
rip = request.getHeader("WL-Proxy-Client-IP");
str += "WL-Proxy-Client-IP=" + rip + "<br>";

str += "<br>";

Properties p = System.getProperties();
Enumeration keys = p.keys();
while (keys.hasMoreElements()) {
    String key = (String)keys.nextElement();
    String value = (String)p.get(key);
    str += key + ": " + value + "<br>";
}
%>

<%= "17:" + str %>

</body>
</html>