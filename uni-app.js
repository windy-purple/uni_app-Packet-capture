Java.perform(function() {
    var RealCall = Java.use("dc.squareup.okhttp3.RealCall");
    var Buffer = Java.use("dc.squareup.okio.Buffer");

    RealCall.getResponseWithInterceptorChain.implementation = function() {
        var response = this.getResponseWithInterceptorChain();
        var request = this.request();
        console.log("==========================start=================================")
        printRequest(request);
        console.log("--------------------------split line----------------------------");
        printResponse(response);
        console.log("==========================end=================================")
        return response;
    }

    function printRequest(request) {
        var HttpUrl = getFieldValue(request, "url");
        var method = getFieldValue(request, "method");
        var Headers = request.headers();

        var url = HttpUrl.toString();
        var headers = Headers.toString();
        var content_type = Headers.get("Content-Type");

        if(url) {
            console.log("[Request]:")
            console.log(method + " " + url);
            console.log(headers);
            var requestBody = request.body();
            var contentLength = requestBody ? requestBody.contentLength() : 0;
            if(contentLength > 0) {
                var bufferobj = Buffer.$new();
                requestBody.writeTo(bufferobj);
                if(ContentTypeIsPrint(content_type) == 1) {
                    var bodystr = bufferobj.readUtf8();
                    console.log(bodystr);
                } else {
                    var bodystr = bufferobj.readByteString().hex();
                    console.log(bodystr);
                }
            }
        }
    }

    function printResponse(response) {
        var code = response.code();
        var Headers = response.headers();
        var message = response.message();
        var Protocol = response.protocol();

        var content_type = Headers.get("Content-Type");

        var headers = Headers.toString();
        var protocol = Protocol.toString()

        console.log("[Response]:")
        console.log(protocol + " " + code + " " + message)
        console.log(headers);

        var responseBody = response.body();
        var contentLength = responseBody ? responseBody.contentLength() : 0;
        if(contentLength > 0) {
            var bufferobj = responseBody.source();
            if(ContentTypeIsPrint(content_type) == 1) {
                var bodystr = bufferobj.readUtf8();
                console.log(bodystr);
            } else {
                var bodystr = bufferobj.readByteString().hex();
                console.log(bodystr);
            }
        }
    }

    function getFieldValue(object, fieldName) {
        var field = object.class.getDeclaredField(fieldName);
        field.setAccessible(true)
        var fieldValue = field.get(object)
        if (null == fieldValue) {
            return null;
        }
        var FieldClazz = Java.use(fieldValue.$className)
        var fieldValueWapper = Java.cast(fieldValue, FieldClazz)
        return fieldValueWapper
    }

    function ContentTypeIsPrint(content_type_string) {
        if(content_type_string.indexOf("application/json") == 0) {
            return 1;
        } else if(content_type_string.indexOf("application/xml") == 0) {
            return 1;
        } else if(content_type_string.indexOf("application/xml") == 0) {
            return 1;
        } else if(content_type_string.indexOf("application/xhtml+xml") == 0) {
            return 1;
        } else if(content_type_string.indexOf("application/soap+xml") == 0) {
            return 1;
        } else if(content_type_string.indexOf("application/x-www-form-urlencoded") == 0) {
            return 1;
        } else if(content_type_string.indexOf("text/") == 0) {
            return 1;
        } else {
            return 0;
        }
    }
})