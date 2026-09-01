# Déploiement — serah-photographie.tracevault.tech

Site statique compilé par Vite, servi par nginx dans un conteneur, exposé par le
Caddy déjà en place sur `srv1415152`.

| | |
|---|---|
| Image Docker | `miaouu/portfolio-serah` |
| Port interne | `3004` (3001/3002/3003 sont pris) |
| Domaine | `serah-photographie.tracevault.tech` |

---

## 1. Construire et pousser l'image

Le serveur tourne en `linux/amd64` : il faut le préciser, sinon une machine
ARM (Mac Apple Silicon) produit une image qui ne démarrera pas là-bas.

```bash
docker login
```

```bash
docker buildx build --platform linux/amd64 -t miaouu/portfolio-serah:latest --push .
```

Pour figer une version en plus du tag flottant :

```bash
docker buildx build --platform linux/amd64 -t miaouu/portfolio-serah:latest -t miaouu/portfolio-serah:2026-09-01 --push .
```

### Avec un service de formulaire

Tant qu'aucune URL n'est fournie, le formulaire de contact ouvre le logiciel de
messagerie du visiteur. Pour un vrai envoi, passez l'URL à la compilation :

```bash
docker buildx build --platform linux/amd64 --build-arg VITE_FORM_ENDPOINT=https://formspree.io/f/VOTRE_ID -t miaouu/portfolio-serah:latest --push .
```

---

## 2. Côté serveur

Le dépôt Docker Hub est privé : la machine doit être authentifiée une fois.

```bash
ssh publisher@srv1415152
```

```bash
docker login
```

Ajoutez le service dans `~/app/docker-compose.yaml` (voir `docker-compose.yml`
de ce dépôt). **Le réseau doit être celui que Caddy utilise déjà** — à vérifier :

```bash
docker inspect $(docker ps --filter name=caddy -q) --format '{{json .NetworkSettings.Networks}}'
```

Puis ajoutez le bloc suivant dans `~/app/Caddyfile` :

```
serah-photographie.tracevault.tech {
    reverse_proxy portfolio-serah:3004 {
        header_up X-Forwarded-Host {host}
        header_up X-Forwarded-Proto {scheme}
    }
    encode gzip
}
```

Démarrage et prise en compte de Caddy :

```bash
cd ~/app && docker compose up -d portfolio-serah
```

```bash
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

---

## 3. Prérequis DNS

Un enregistrement `A` (ou `CNAME` vers `tracevault.tech`) pour
`serah-photographie` doit pointer sur le serveur **avant** le rechargement de
Caddy : c'est lui qui déclenche l'émission du certificat Let's Encrypt.

---

## 4. Mettre à jour le site

```bash
docker buildx build --platform linux/amd64 -t miaouu/portfolio-serah:latest --push .
```

```bash
ssh publisher@srv1415152 'cd ~/app && docker compose pull portfolio-serah && docker compose up -d portfolio-serah'
```

Les fichiers produits par Vite portent un nom haché et sont servis en
`immutable` pendant un an ; `index.html` est marqué `no-cache`, donc un
rechargement suffit à voir la nouvelle version.

---

## 5. Vérifications

```bash
docker compose logs -f portfolio-serah
```

```bash
curl -I https://serah-photographie.tracevault.tech
```

Attendu : `200`, `content-type: text/html`, et `cache-control: no-cache` sur la
page. Sur un fichier `/assets/…`, `cache-control: public, max-age=31536000`.
