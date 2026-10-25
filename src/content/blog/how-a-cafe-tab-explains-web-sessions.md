---
title: "How a Café Tab Explains Web Sessions"
subtitle: "How a cookie connects separate browser requests to one running record"
description: "Follow a café tab from its first order to its final bill to see how a browser cookie and a server-side session maintain continuity across requests."
sequence: 14
category: "Web security"
historicalPeriod: "1994–2011"
author: "Attila Kulik"
tags: ["HTTP", "Cookies", "Web sessions", "Web security"]
heroImage: "/images/cafe-tab-web-sessions-feature-photo.png"
heroImageAlt: "Sunlit café counter with tea, cake, a claim card and a register showing both items on one tab"
pubDate: 2026-10-25
draft: false
---

You order tea at a café, then return to the counter for cake. At the end, you want one bill for both. The cashier could try to remember your face, but imagine a busy café where each order goes to a different cashier. Instead, the first cashier opens a running tab in the register and hands you a card with an unpredictable claim code. You show the card with the second order. The cashier looks up the same tab and adds the cake.

A website faces a similar problem. Your browser might request a menu, submit an order and later ask to see the total. These are separate **HTTP requests**. HTTP does not, by itself, remember that the requests belong to one visit; the server needs a way to connect them. In one common design, the server keeps a **session record** and gives the browser a **cookie** containing an identifier for that record. The browser returns the cookie with later requests that match its scope. [RFC 9110 describes HTTP as stateless](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.3), while [RFC 6265 defines the cookie exchange](https://www.rfc-editor.org/rfc/rfc6265.html#section-3).

## What the café keeps, and what you carry

The card does not need to list everything you bought. It needs a code that lets the cashier find your tab. The register holds the order history. In the web version, the cookie can carry a session identifier while the website keeps the corresponding record. This is **one way** to use a cookie: cookies can hold other small values, and websites can manage state in other ways.

| At the café | On the website |
| --- | --- |
| You make a new order | The browser sends an HTTP request |
| A cashier answers | The server sends an HTTP response |
| A claim code is printed on your card | The server sets a cookie containing a session identifier |
| You present the card again | The browser returns the cookie on a matching request |
| The register holds tea, cake and the total | The server-side session record holds the running tab |
| The café closes the tab | The server ends or expires the session record |

The distinction matters: **the code points to the record; it is not the record**. The server can update the order without rewriting the whole history onto your card. A different cashier can still retrieve it, provided the café's register is shared. A web server similarly reads the identifier and finds the current session state before handling the next request.

## Four requests, one running tab

Consider an invented café website at `cafe.example`, reached over HTTPS. The paths, orders and identifier are teaching examples, not traffic captured from a real café. The identifier `R8x4Q9m2` is shortened for readability; a real session identifier should be much longer and generated unpredictably. These snippets show the relevant lines rather than complete HTTP messages.

**1. Look at the menu.** A new visitor asks for the menu. No tab exists yet, and the browser has no session cookie for this café.

```http
GET /menu HTTP/1.1
Host: cafe.example

HTTP/1.1 200 OK
[menu page]
```

The server can return that page without knowing who asked. It does not have to create a session merely because someone viewed the menu.

**2. Order tea.** The browser submits the first order. The server creates a tab record containing the tea order, chooses an identifier and sends that identifier back in a `Set-Cookie` response header.

```http
POST /tab HTTP/1.1
Host: cafe.example

item=tea

HTTP/1.1 200 OK
Set-Cookie: sid=R8x4Q9m2; Path=/; Secure; HttpOnly

[tab: tea]
```

The browser stores the cookie. The server's session store now has an entry such as `R8x4Q9m2 → [tea]`. The cookie name `sid` stands for “session identifier” in this example; the name itself has no special status. [RFC 6265 shows the same `Set-Cookie` response and `Cookie` request pattern](https://www.rfc-editor.org/rfc/rfc6265.html#section-3.1).

**3. Add cake.** The next request goes to the same website. Because the cookie applies to this request, the browser includes it automatically in a `Cookie` header. The server finds the record and adds cake.

```http
POST /tab/items HTTP/1.1
Host: cafe.example
Cookie: sid=R8x4Q9m2

item=cake

HTTP/1.1 200 OK
[tab: tea, cake]
```

The server-side entry is now `R8x4Q9m2 → [tea, cake]`. The cookie has not become a list of orders. It still holds the same identifier.

**4. Ask for the bill.** On one more separate request, the browser sends the same cookie, allowing the server to look up the record and return both items.

```http
GET /tab HTTP/1.1
Host: cafe.example
Cookie: sid=R8x4Q9m2

HTTP/1.1 200 OK
[tab: tea, cake]
```

![Four separate browser requests: a menu request has no cookie; the tea order creates a server-side tab and receives a Set-Cookie header; the browser includes the cookie with its cake and bill requests so the server can find the same tab.](/images/cafe-tab-web-sessions-flow.svg)

*The identifier joins the requests to one server-side record. The orders shown in the diagram remain on the server.*

The browser sends a stored cookie only when the request matches its rules, including its host and path. The example's `Path=/` applies throughout this café website, `Secure` limits sending the cookie to a secure connection, and `HttpOnly` keeps ordinary browser scripts from reading it. Those attributes are **instructions to the browser**, not part of the `Cookie` header that comes back. [RFC 6265 describes the attributes and the matching rules](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2).

## The tab can be anonymous

Nothing in those four requests says which person ordered the tea. The session connects requests that carry a valid identifier; it is not proof of a customer's legal name or even proof that the same person is at the keyboard. That is why an anonymous shopping cart can remember items before you sign in. If you later authenticate, a site can associate a session with your account, subject to its security rules. For the identity step, see [*Prove It Once: How Login, Sessions and Tokens Work*](/prove-it-once-how-login-sessions-and-tokens-work/).

The claim code also explains a risk. Anyone who obtains a valid code could present it. A session identifier therefore needs to be difficult to guess and protected in transit and storage. [OWASP's session-management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) recommends unpredictable identifiers and protections such as secure cookie attributes. The illustrative `R8x4Q9m2` is far shorter than a production session identifier should be.

When the café closes a tab, its register should stop accepting the card. Likewise, a website can delete or invalidate its session record. The browser might still hold a cookie with the old identifier, but the server can reject it because no active record matches. If the browser deletes its cookie while the server keeps the record, that browser can no longer retrieve the tab through that session; a copied identifier could still work until the server invalidates or expires it. Expiry is therefore a server-side decision as well as a possible browser cookie setting.

## Why websites gained cookies

This problem became pressing as early websites tried to add shopping carts. Netscape engineer Lou Montulli recalled that in **1994** colleagues asked how their shopping server could keep a cart across requests for different pages. He devised a way for a website to send information to a browser and have the browser return it on later requests. His account describes a session identifier as a central use, while also noting that a cookie could carry other information. [His firsthand account explains the shopping-cart motivation and design](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html). The later [RFC 6265, published in 2011](https://www.rfc-editor.org/rfc/rfc6265.html), specifies the familiar `Set-Cookie` and `Cookie` headers.

The café story has limits. A customer deliberately hands over a card, but the browser automatically sends an eligible cookie. A cashier might recognise your face; an anonymous website session does not recognise a person. If you lose a café card, the staff may find another way to recover your bill; a website cannot safely assume that a request without the identifier belongs to the earlier tab. And closing a browser *tab* is not the same action as closing a running café *tab*: the browser may keep the cookie and return it later.

The useful picture is simpler than the whole web: **each order stands alone, a returned code finds the running record, and the record is what carries the story forward**.

## Sources

- IETF, [RFC 9110: *HTTP Semantics*, section 3.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.3), for HTTP's stateless nature.
- IETF, [RFC 6265: *HTTP State Management Mechanism*](https://www.rfc-editor.org/rfc/rfc6265.html), especially sections 3 and 4, for the `Set-Cookie`/`Cookie` exchange and cookie attributes.
- Lou Montulli, [“The reasoning behind Web Cookies”](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), 2013, for his account of the 1994 shopping-cart problem and cookie design.
- OWASP, [*Session Management Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), for session identifier unpredictability, server-side invalidation and cookie protections.

The café, orders, paths, session identifier and HTTP exchange are invented teaching examples.
