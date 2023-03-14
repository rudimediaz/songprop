import type { Component, JSX } from "solid-js";
import {
  mergeProps,
  createSignal,
  createMemo,
  createEffect,
  on,
  onMount,
  onCleanup,
} from "solid-js";
import c from "./SearchBar.module.css";

interface SearchBarProps {
  projection?: boolean;
  shared?: boolean;
}

const [sharedValue, setSharedValue] = createSignal("");

const SearchBar: Component<SearchBarProps> = (props) => {
  props = mergeProps(
    { projection: false, shared: false },
    props
  ) as Required<SearchBarProps>;

  const projection = createMemo(() => props.projection!);
  let inputEl: HTMLInputElement;

  const [privateValue, setPrivateValue] = createSignal("");
  const [needSpace, setNeedSpace] = createSignal(false);

  const inputValue = createMemo(() => {
    if (props.shared === true) {
      return sharedValue();
    } else {
      return privateValue();
    }
  });

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    if (props.shared === true) {
      setSharedValue(e.currentTarget.value);
    } else {
      setPrivateValue(e.currentTarget.value);
    }
  };

  onMount(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      const projectionMaster = document.querySelector(
        `[data-search-bar-master="true"]`
      );

      const focused = document.activeElement === inputEl;

      if (projectionMaster && entries[0].isIntersecting === false && focused) {
        (projectionMaster as HTMLInputElement).focus();
        return;
      }

      if (projectionMaster && entries[0].isIntersecting) {
        if (document.activeElement === projectionMaster) {
          (projectionMaster as HTMLInputElement).blur();
          inputEl.focus();
        }

        return;
      }
    };

    const inter = new IntersectionObserver(callback);
    if (props.projection === true) {
      inter.observe(inputEl);
    }
    onCleanup(() => {
      if (props.projection === true && inputEl) {
        inter.unobserve(inputEl);
      }
    });
  });

  createEffect(
    on(needSpace, (v) => {
      const siblings = document.querySelectorAll("[data-searchbar-sibling]");

      for (const sib of siblings) {
        if (v == true && props.projection === false) {
          sib.classList.add("searchbar_space");
        } else {
          sib.classList.remove("searchbar_space");
        }
      }
    })
  );

  return (
    <form style={{ display: "contents" }} action="/search" method="get">
      <div class={`relative ${c.ctn_textfield}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          class={`${c.search_icon}`}
          classList={{ [c.projection]: projection() }}
        >
          <path
            fill="currentColor"
            d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9s-9-4.032-9-9s4.032-9 9-9zm0 16c3.867 0 7-3.133 7-7c0-3.868-3.133-7-7-7c-3.868 0-7 3.132-7 7c0 3.867 3.132 7 7 7zm8.485.071l2.829 2.828l-1.415 1.415l-2.828-2.829l1.414-1.414z"
          ></path>
        </svg>
        <input
          ref={inputEl!}
          autocomplete="off"
          data-search-bar-master={props.projection === false}
          type="search"
          name="q"
          id="search-bar"
          value={inputValue()}
          onInput={handleInput}
          placeholder="Search on Songprop"
          classList={{ [c.projection]: projection() }}
          onFocus={() => {
            setNeedSpace(true);
          }}
          onBlur={() => {
            setNeedSpace(false);
          }}
        />
        <label for="search-bar" class="sr-only">
          keyword
        </label>
      </div>
      <button
        type="submit"
        class={`${c.search_submit}`}
        classList={{ [c.projection]: projection() }}
        data-spotlight-color-agent
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
