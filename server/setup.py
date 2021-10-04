import fireo
from ariadne import gql, load_schema_from_path, make_executable_schema
from flask import Flask
from flask_cors import CORS

from api import query, mutation

# Initialize for GraphQL We'll create this schema soon
type_defs = gql(load_schema_from_path("./schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)

# Initialize Firebase
fireo.connection(from_file="./keys/ecoOcean_firebase_key.json")
# Initialize Flask Server
app = Flask(__name__)

cors = CORS(app, resources={r"/graphql/*": {"origins": "*"}})
