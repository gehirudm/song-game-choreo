### Some Choreo quirks
1. When deploying a docker container on choreo, choreo will do some dockerfile scans.
    - `CKV_CHOREO_1` can occur when you don't have `USER <10000-20000>` set. (**But make sure, you have to set it inline, not using a variable**)
        - [A good Dockerfile template](https://stackoverflow.com/questions/78124189/ensure-user-is-set-to-a-value-between-10000-and-20000)