import { shallowMount } from '@vue/test-utils';
import BaseButton from '@/components/BaseButton.vue';

describe('BaseButton.vue', () => {
  it('renders content', () => {
    const content = 'Hello';
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: content,
      },
    });
    expect(wrapper.text()).toMatch(content);
  });
});
