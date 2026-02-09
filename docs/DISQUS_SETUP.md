# Disqus 댓글 로드 오류 해결

"We were unable to load Disqus" 메시지가 나오면 아래를 순서대로 확인하세요.

---

## 1. Trusted Domains 등록 (가장 흔한 원인)

Disqus는 **도메인을 허용 목록에 넣어야** 해당 사이트에서만 embed가 로드됩니다.

1. [Disqus Admin](https://disqus.com/admin/) 로그인
2. 해당 사이트(댓글을 붙인 포럼) 선택
3. **Settings** → **Advanced** → **Trusted Domains**
4. 아래 도메인을 **추가** 후 저장:
   - `sims-fashion.pages.dev`
   - (사용 중인 커스텀 도메인이 있으면 함께 추가)
   - 로컬 테스트 시: `localhost`
5. 저장 후 사이트를 **새로고침** (캐시 무시: Ctrl+Shift+R)

---

## 2. Shortname 확인

embed 스크립트의 shortname이 Disqus에 만든 포럼과 같아야 합니다.

1. Disqus Admin → **Settings** → **General**
2. **Shortname** 확인 (현재 프로젝트 사용값: `https-sims-fashion-pages-dev`)
3. 프로젝트의 `index.html`에서 댓글 섹션 옆 **data-disqus-shortname** 값이 위 Shortname과 동일한지 확인:
   ```html
   <section id="comments" ... data-disqus-shortname="https-sims-fashion-pages-dev">
   ```
4. 다르면 `index.html`에서 `data-disqus-shortname="본인_shortname"` 으로 수정 후 재배포

---

## 3. 포럼 생성 여부

아직 Disqus에 사이트(포럼)를 만들지 않았다면:

1. [Disqus - Create Site](https://disqus.com/admin/create/) 이동
2. 사이트 이름, 카테고리, Shortname 등 입력 후 생성
3. 생성 후 위 1번(Trusted Domains)과 2번(Shortname)을 반드시 설정

---

## 4. 공식 가이드

- [Disqus Troubleshooting](https://help.disqus.com/en/articles/1717196-embed-code-troubleshooting)
- [Trusted Domains](https://help.disqus.com/en/articles/1717163-how-to-add-a-trusted-domain)

---

**요약:** 대부분 **Trusted Domains에 `sims-fashion.pages.dev`를 추가**하면 해결됩니다.
