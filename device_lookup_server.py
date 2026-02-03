#!/usr/bin/env python3
"""
TrueView Device Lookup Server
Handles authentication and fetches device information
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import requests
import hashlib
import math
from datetime import datetime

class DeviceLookupHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/lookup':
            self.handle_lookup(parsed_path)
        elif parsed_path.path == '/':
            self.serve_html()
        else:
            self.send_error(404, "Not Found")
    
    def serve_html(self):
        """Serve the HTML file"""
        try:
            with open('/home/hj/Projects/trueview-sdk/device_lookup.html', 'r') as f:
                html_content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(html_content.encode())
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_lookup(self, parsed_path):
        """Handle device lookup API calls"""
        try:
            # Parse query parameters
            query_params = parse_qs(parsed_path.query)
            device_id = query_params.get('id', [''])[0]
            
            if not device_id:
                self.send_json_response(400, {'error': 'Missing device_id'})
                return
            
            result = self.lookup_device(device_id)
            self.send_json_response(200, result)
        except Exception as e:
            print(f"Error: {e}")
            self.send_json_response(500, {'error': str(e)})
    
    def lookup_device(self, device_id):
        """Lookup device information from TrueView API"""
        result = {}
        
        try:
            # Step 1: Get nonce from openapi
            nonce_response = requests.get('https://openapi.dvr163.com/message/nonce?method=get', timeout=5)
            nonce_data = nonce_response.json()
            
            nonce = nonce_data.get('nonce', '')
            request_id = nonce_data.get('request_id', '')
            
            if not nonce or not request_id:
                return {'error': 'Failed to get nonce'}
            
            # Step 2: Get serial number from openapi
            verify_string = nonce.upper() + device_id + request_id.upper() + 'Japass^2>.j'
            verify_hash = hashlib.md5(verify_string.encode()).hexdigest()
            
            device_url = f'https://openapi.dvr163.com/device/device?method=get_sn&id={device_id}&request_id={request_id}&verify={verify_hash}'
            device_response = requests.get(device_url, timeout=5)
            device_data = device_response.json()
            
            result['sn'] = device_data.get('sn', 'N/A')
            
            # Step 3: Get connection details from ngw-cli endpoint
            ngw_data = self.get_ngw_data(device_id)
            
            if ngw_data:
                result.update(ngw_data)
            
            return result
        
        except Exception as e:
            return {'error': f'Lookup failed: {str(e)}'}
    
    def get_ngw_data(self, device_id):
        """Get data from ngw-cli endpoint with proper authentication"""
        try:
            # Extract device ID properly (last 10 digits or from first non-zero)
            if len(device_id) > 10:
                for i in range(len(device_id) - 10, len(device_id)):
                    if device_id[i] != '0':
                        device_id = device_id[i:]
                        break
                else:
                    device_id = device_id[-10:]
            
            print(f"Extracted device_id: {device_id}")
            
            channel_count = 1
            extconv = 0
            import random
            r = random.randint(1000000, 9999999)
            timestamp = int(datetime.now().timestamp())
            
            # Build auth string EXACTLY as SDK does
            auth_string = f'ch_count={channel_count}&extconv={extconv}&id={device_id}&r={r}&timestamp={timestamp}'
            auth_string_upper = auth_string.upper()
            
            print(f"Auth string: {auth_string_upper}")
            
            # Calculate signature EXACTLY as SDK does
            auth_md5 = hashlib.md5(auth_string_upper.encode()).hexdigest()
            print(f"Auth MD5: {auth_md5}")
            
            # Extract substring for signature
            pos = timestamp % 10
            length = int(timestamp / 10) % 10 + 1
            
            print(f"Pos: {pos}, Length: {length}")
            
            sign_base = auth_md5[pos:pos + length] + f'9an-ngw$app&*{timestamp}'
            print(f"Sign base: {sign_base}")
            
            signature = hashlib.md5(sign_base.encode()).hexdigest()
            print(f"Signature: {signature}")
            
            # Build URL with signature
            ngw_url = f'https://ngw-cli.dvr163.com/?{auth_string}&sign={signature}'
            
            print(f"NGW URL: {ngw_url}")
            
            # Make request with headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
            }
            
            response = requests.get(ngw_url, headers=headers, timeout=5, verify=False)
            
            print(f"NGW Response Status: {response.status_code}")
            print(f"NGW Response Headers: {dict(response.headers)}")
            print(f"NGW Response: {response.text[:500]}")
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"NGW Error: {response.status_code}")
                return None
        
        except Exception as e:
            print(f"NGW Exception: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def send_json_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to add timestamps to logs"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")


if __name__ == '__main__':
    import ssl
    import urllib3
    
    # Suppress SSL warnings
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    server_address = ('127.0.0.1', 9000)
    httpd = HTTPServer(server_address, DeviceLookupHandler)
    
    print(f"Server started at http://127.0.0.1:9000")
    print(f"Open http://127.0.0.1:9000 in your browser")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()
