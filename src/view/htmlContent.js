function applications(){
    return `
    <html>
    <head>
    </head>
    <script type = "text/javascript"
      src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
      </script>
    <script type = "text/javascript">
    const vscodeApi = acquireVsCodeApi();
    $(document).ready(function(){
        Applications_load();
    })

    function Applications_load(){
        var app_url = 'http://rs23.rocketsoftware.com:9153/ws/policy/applications';
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET',app_url,true);
        xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('csmvdqe:9JIPIGI'));
        xhr.onload = function() {
            data = xhr.response;
            vscodeApi.postMessage({
                msg:data
            });
        }
        xhr.onerror = function() {
            vscodeApi.postMessage({
                msg:"Error while loading applications"
            });
        };
        xhr.send();
      }
      </script>
      </html>
    `
}

module.exports = {
    applications
}