<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/HurayraIIT/e2e-betterlinks">
    <img src="https://playwright.dev/img/playwright-logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">BetterLinks Test Automation</h3>

  <p align="center">
    End-to-end test automation for BetterLinks WordPress Plugin using playwright node.js
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">
<a href="https://betterlinks.io">
    <img src="https://store.assets.wpdeveloper.com/2021/11/betterlinks-icon-100x100.png" alt="Logo" width="80" height="80">
  </a>
</div>

BetterLinks is a popular WordPress plugin with thousands of users worldwide. This project creates e2e automation scripts for BetterLinks FREE & PRO plugins.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Node][Node.js]][Node-url]
* [![Playwright][Playwright.js]][Playwright-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Let's get started!!

### Prerequisites

The project requires Node.js version 22 LTS and npm.

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/HurayraIIT/e2e-betterlinks.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create the `.env` file and provide necessary details
   ```sh
   cp .env.example .env
   ```
4. Update/Install playwright browsers.
   ```sh
   npx playwright install --with-deps
   ```
5. Create storage state files.
  ```sh
  mkdir -p playwright/.auth && cd playwright/.auth
  for role in admin editor author contributor subscriber unauth; do echo "{}" > "$role.json"; done
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

To run the tests:

```sh
npx playwright test
```

_For more examples, please refer to the [Documentation](https://playwright.dev)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Begin Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/HurayraIIT/e2e-betterlinks/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HurayraIIT/e2e-betterlinks" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Abu Hurayra - [@hurayraiit](https://twitter.com/hurayraiit) - hurayraiit@gmail.com

Project Link: [https://github.com/HurayraIIT/e2e-betterlinks](https://github.com/HurayraIIT/e2e-betterlinks)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template/blob/main/README.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/HurayraIIT/e2e-betterlinks.svg?style=for-the-badge
[contributors-url]: https://github.com/HurayraIIT/e2e-betterlinks/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HurayraIIT/e2e-betterlinks.svg?style=for-the-badge
[forks-url]: https://github.com/HurayraIIT/e2e-betterlinks/network/members
[stars-shield]: https://img.shields.io/github/stars/HurayraIIT/e2e-betterlinks.svg?style=for-the-badge
[stars-url]: https://github.com/HurayraIIT/e2e-betterlinks/stargazers
[issues-shield]: https://img.shields.io/github/issues/HurayraIIT/e2e-betterlinks.svg?style=for-the-badge
[issues-url]: https://github.com/HurayraIIT/e2e-betterlinks/issues
[license-shield]: https://img.shields.io/github/license/HurayraIIT/e2e-betterlinks.svg?style=for-the-badge
[license-url]: https://github.com/HurayraIIT/e2e-betterlinks/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/hurayraiit
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
