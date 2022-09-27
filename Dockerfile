FROM oraclelinux:7-slim
ENV NO_PROXY=.cluster.local,.corp.ads,.svc,.tsl.telus.com,.tmi.telus.com,.ent.agt.ab.ca,10.1.0.0/16,10.128.0.0/14,100.66.198.0/24,100.66.198.11,100.66.198.12,100.66.198.13,169.254.169.254,172.30.0.0/16,172.30.0.1,btln008573.corp.ads,btln008574.corp.ads,btln008575.corp.ads,btln008591.corp.ads,btln008592.corp.ads,btln008593.corp.ads,btln008594.corp.ads,btln008595.corp.ads,btln008596.corp.ads,btln008597.corp.ads,btln008598.corp.ads,btln008599.corp.ads,btln008600.corp.ads,btln008601.corp.ads,btln008602.corp.ads,paas-int-master-west2-np.tsl.telus.com
ENV http_proxy=http://webproxystatic-bc.tsl.telus.com:8080/
ENV HTTPS_PROXY=http://webproxystatic-bc.tsl.telus.com:8080/
ENV https_proxy=http://webproxystatic-bc.tsl.telus.com:8080/
ENV no_proxy=.cluster.local,.corp.ads,.svc,.tsl.telus.com,.tmi.telus.com,.ent.agt.ab.ca,10.1.0.0/16,10.128.0.0/14,100.66.198.0/24,100.66.198.11,100.66.198.12,100.66.198.13,169.254.169.254,172.30.0.0/16,172.30.0.1,btln008573.corp.ads,btln008574.corp.ads,btln008575.corp.ads,btln008591.corp.ads,btln008592.corp.ads,btln008593.corp.ads,btln008594.corp.ads,btln008595.corp.ads,btln008596.corp.ads,btln008597.corp.ads,btln008598.corp.ads,btln008599.corp.ads,btln008600.corp.ads,btln008601.corp.ads,btln008602.corp.ads,paas-int-master-west2-np.tsl.telus.com
ENV HTTP_PROXY=http://webproxystatic-bc.tsl.telus.com:8080/
RUN  yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
     yum-config-manager --disable ol7_developer_EPEL && \
     yum -y install oracle-instantclient19.3-basiclite nodejs && \
     rm -rf /var/cache/yum
WORKDIR /home/app/ivs
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npm", "start"]