# Remove all data allocated to docker volumes
docker compose down;
rm -rf ./postgres_data;
docker compose up -d;