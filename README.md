## This script provides API end-points to name pic IDs

## Database used

- SQLite3 is used to store pic IDs and their aliases

## API end-points

| route       | method | body                        | query params    | purpose                           |
| ----------- | ------ | --------------------------- | --------------- | --------------------------------- |
| /rename/:id | POST   | ```{ "name" : "picname"}``` | NA              | renames/names pic ID              |
| /id         | GET    | NA                          | `name="picname" | fetches pic id for the given name |
| /all-names  | GET    | NA                          | NA              | fetches all names ever defined    |

## env variables

| name         | value                             |
| ------------ | --------------------------------- |
| DB_FILE_PATH | file path of sqlite database file |
| PORT         | server port                       |
| NODE_ENV     | production \|\| development       |
