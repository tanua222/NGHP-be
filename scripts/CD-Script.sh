#!/bin/bash

version=$(sed 's/.*"version": "\(.*\)".*/\1/;t;d' ../package.json)

clear
echo "Starting CD shell script...";
image_name='harbor.tsl.telus.com/oe-b2b-evs/ivs-hierarchy'
read -p "Enter Image Tag ($version): " tag
tag="${tag:=$version}"
echo "Tag: $tag"

read -p "Enter Environment: (dv/pt148/pt/pt140/st/pr/dr): " environment
echo "Environment: $environment"

if [ $environment != "dr" ] && [ $environment != "pr" ] && [ $environment != "dv" ] && [ $environment != "pt140" ] && [ $environment != "pt148" ] && [ $environment != "pt" ] && [ $environment != "st" ]; then
	echo "Usage: CD-Script.sh <Environment For Example: dv/pt140/pt148/pt/st/pr/dr>" 
	exit
fi

read -p "Enter Cluster: (k=knk8s001, q=qnk8s002, <empty=use current-context in .kube/config>): " cluster

if ! [[  -z "$cluster" ]]; then
  if [ $cluster != "k" ] && [ $cluster != "q" ]; then
    echo "Error: Invalid cluster. Choose from: [k,q]"
    exit
  fi

  if [ $cluster == "k" ]; then
    cluster="knk8s001";
  else
    cluster="qnk8s002";
  fi

	echo "Cluster: $cluster"
  kubectl config use-context $cluster
else
  echo "Cluster: current-context .kube/config";
fi

# this is one time job, if you are deploying the application for the first time in K8S then only enable it otherwise comment it
# kubectl apply -n oe-b2b-evs-$environment -f ../k8s-configuration/ivs-hierarchy-secret.yaml

cd ..

mkdir -p chart/ivs-hierarchy/config

cp config/* chart/ivs-hierarchy/config

cd chart

helm upgrade --install --history-max 1 --namespace oe-b2b-evs-$environment ivshaarelease --set image.tag=$tag ivs-hierarchy -f values-$environment.yaml

#Get all Pods
kubectl get pod -n oe-b2b-evs-$environment
rm -rf ivs-hierarchy/config

docker pull $image_name:$tag
docker tag $image_name:$tag $image_name:$environment
docker push $image_name:$environment
echo "CD-script complete."

