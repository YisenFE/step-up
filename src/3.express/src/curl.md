```bash
curl -v -X GET \
    'http://localhost:3000/users/34/books/123' \
    -H 'Accept-Type: application/json;charset=UTF-8' \
    -H 'Accept: application/json, text/plain, */*' \
    --data-raw '{"id":123455}' \
    --compressed \
    --insecure
```
```bash
curl -X POST \
    'http://localhost:3000/' \
    -H 'Accept-Type: application/json;charset=UTF-8' \
    -H 'Accept: application/json, text/plain, */*' \
    --data-raw '{"id":123455}' \
    --compressed \
    --insecure
```
