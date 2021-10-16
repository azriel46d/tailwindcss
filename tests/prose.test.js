import { run, html, css } from './util/run'

it('should work as well', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="hover:file:bg-pink-600"></div>
          <div class="file:hover:bg-pink-600"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .hover\\:file\\:bg-pink-600::file-selector-button:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(219 39 119 / var(--tw-bg-opacity));
      }

      .file\\:hover\\:bg-pink-600:hover::file-selector-button {
        --tw-bg-opacity: 1;
        background-color: rgb(219 39 119 / var(--tw-bg-opacity));
      }
    `)
  })
})

it('should do stuff', () => {
  let config = {
    content: [
      {
        raw: html` <div class="hover:space-x-4"></div> `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .hover\\:space-x-4:hover > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 0;
        margin-right: calc(1rem * var(--tw-space-x-reverse));
        margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
      }
    `)
  })
})

it('should also do stuff', () => {
  let config = {
    content: [
      {
        raw: html` <div class="md:space-x-4"></div> `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 768px) {
        .md\\:space-x-4 > :not([hidden]) ~ :not([hidden]) {
          --tw-space-x-reverse: 0;
          margin-right: calc(1rem * var(--tw-space-x-reverse));
          margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
        }
      }
    `)
  })
})

it('should have a default variant-target', () => {
  let config = {
    content: [
      {
        raw: html` <div class="hover:text-center"></div> `,
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .hover\\:text-center:hover {
        text-align: center;
      }
    `)
  })
})

it('should be possible to use a group selector', () => {
  let config = {
    content: [
      {
        raw: html` <div class="group-hover:text-center"></div> `,
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .group:hover .group-hover\\:text-center {
        text-align: center;
      }
    `)
  })
})

it('should be possible to move the variant target', () => {
  let config = {
    content: [
      {
        raw: html` <div class="prose-headings:text-center"></div> `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('prose-headings', ({ format }) => {
          return format(':where(&) :is(h1, h2, h3, h4)')
        })
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :where(.prose-headings\\:text-center) :is(h1, h2, h3, h4) {
        text-align: center;
      }
    `)
  })
})

it('should be possible to move the variant target in combination with other variants', () => {
  let config = {
    content: [
      {
        raw: html` <div class="hover:prose-headings:text-center"></div> `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('prose-headings', ({ format }) => {
          return format(':where(&) :is(h1, h2, h3, h4)')
        })
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :where(.hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4):hover {
        text-align: center;
      }
    `)
  })
})

it('group-hover', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="prose-headings:group-hover:text-center"></div>
          <div class="group-hover:prose-headings:text-center"></div>
        `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('prose-headings', ({ format }) => {
          return format(':where(&) :is(h1, h2, h3, h4)')
        })
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :where(.group:hover .prose-headings\\:group-hover\\:text-center) :is(h1, h2, h3, h4) {
        text-align: center;
      }

      .group:hover :where(.group-hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4) {
        text-align: center;
      }
    `)
  })
})

it('combine group variants', () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-focus:group-hover:group-open:text-center"></div>`,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .group:focus:hover[open] .group-focus\\:group-hover\\:group-open\\:text-center {
        text-align: center;
      }
    `)
  })
})

it('combine group and peer variants', () => {
  let config = {
    content: [
      {
        raw: html`<div class="group">
          <input class="peer" type="text" />
          <div class="peer-focus:group-hover:text-center">
            Centered if group is hovered and input is focused
          </div>
        </div>`,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .peer:focus ~ .group:hover .peer-focus\\:group-hover\\:text-center {
        text-align: center;
      }
    `)
  })
})

it('combine multiple group and peer variants', () => {
  let config = {
    content: [
      {
        raw: html`<div class="group">
          <input class="peer" type="text" />
          <div class="peer-focus:peer-hover:group-hover:group-last:text-center">
            Centered if group is hovered and input is focused
          </div>
        </div>`,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .peer:focus:hover
        ~ .group:hover:last-child
        .peer-focus\\:peer-hover\\:group-hover\\:group-last\\:text-center {
        text-align: center;
      }
    `)
  })
})

it('before', () => {
  let config = {
    content: [
      {
        raw: html`<div class="before:text-center"></div>`,
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .before\\:text-center::before {
        content: '';
        text-align: center;
      }
    `)
  })
})

it('prose', () => {
  let config = {
    content: [
      {
        raw: html`
          <div
            class="group-hover:prose-headings:text-center prose-headings:group-hover:text-center hover:prose-headings:text-center prose-headings:hover:text-center"
          >
            <div class="group">
              <h1 class="text-left">Hello World</h1>
              <h2>
                <span>Icon</span>
                <span>Hello</span>
              </h2>
            </div>
          </div>
        `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('prose-headings', ({ format }) => {
          return format(':where(&) :is(h1, h2, h3, h4)')
        })
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .text-left {
        text-align: left;
      }

      :where(.hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4):hover {
        text-align: center;
      }

      :where(.prose-headings\\:hover\\:text-center:hover) :is(h1, h2, h3, h4) {
        text-align: center;
      }

      .group:hover :where(.group-hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4) {
        text-align: center;
      }

      :where(.group:hover .prose-headings\\:group-hover\\:text-center) :is(h1, h2, h3, h4) {
        text-align: center;
      }
    `)
  })
})
