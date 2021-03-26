#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import webbrowser

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print("Serving from: http://localhost:" + str(port) + "/")
    webbrowser.open("http://localhost:" + str(port) + "/", new=2)
    test(CORSRequestHandler, HTTPServer, port=port)