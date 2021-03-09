export default
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>当前目录内容</title>
</head>
<body>
    <ul>
        <% arr.forEach(item => { %>
            <li><a href="<%= item.href %>"><%= item.content %></a></li>
        <% }) %>
    </ul>
</body>
</html>`
