### Project API URLs

------------------------------------------------------------------------------------------

<summary><code>GET</code> <code><b>/</b></code> <code>(Index page of website)</code></summary>

------------------------------------------------------------------------------------------

<summary><code>GET</code> <code><b>/account/register</b></code> <code>(Register page of website)</code></summary>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code>
    <code><b>/account/register</b></code>
    <code>(Register from submitted form)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username      |  required | string   | N/A  |
> | password      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code> 
    <code><b>/account/login</b></code> 
    <code>(Find token using username and password)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username      |  required | string   | N/A  |
> | password      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok", "token": "user token"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code> 
    <code><b>/q/tasks</b></code> 
    <code>(Query user tasks using token)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok", "tasks": [{"task_id": id, "task_desc": description, "task_status": status, "task_start_date": staart date, "task_end_date": end date}]}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code> 
    <code><b>/q/stats</b></code> 
    <code>(Count of user done and undone tasks)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok", "done_tasks": number of done tasks, "undone_tasks": number of undone tasks}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code> 
    <code><b>/tasks/status</b></code> 
    <code>(Changes The task status with id, token, and sent status)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | task_id      |  required | number   | N/A  |
> | task_status      |  required | string   | N/A  |
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary>
    <code>POST</code> 
    <code><b>/tasks/add</b></code> 
    <code>(Adds a task for a user)</code>
</summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | task_title      |  required | string   | N/A  |
> | task_desc      |  required | string   | N/A  |
> | task_status      |  required | string   | N/A  |
> | task_start_date      |  required | string   | N/A  |
> | task_end_date      |  required | string   | N/A  |
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary><code>POST</code> <code><b>/tasks/edit</b></code> <code>(Edit a task with sent data)</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | task_title      |  required | string   | N/A  |
> | task_desc      |  required | string   | N/A  |
> | task_status      |  required | string   | N/A  |
> | task_start_date      |  required | string   | N/A  |
> | task_end_date      |  required | string   | N/A  |
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

<details>
<summary><code>POST</code> <code><b>/tasks/remove</b></code> <code>(Removes a task using user token and task id)</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | task_id      |  required | string   | N/A  |
> | token      |  required | string   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"status": "ok"}`                                |
> | `404`         | `application/json`                | `{"status": "not found"}`                            |
> | `500`         | `application/json`         | `{"status": "error", "exception": "error message"}`                                                                |
</details>

------------------------------------------------------------------------------------------

