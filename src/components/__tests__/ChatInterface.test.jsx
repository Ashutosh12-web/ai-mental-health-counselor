import { describe, it, expect } from 'vitest';
import { getWaitingOptions } from '../ChatInterface';

describe('ChatInterface Logic Tests', () => {
  describe('getWaitingOptions', () => {
    
    it('should always return "breathe" and "quote" options for all moods', () => {
      const moods = ['happy', 'sad', 'anxious', 'neutral'];
      
      moods.forEach(mood => {
        const options = getWaitingOptions(mood);
        const optionIds = options.map(o => o.id);
        
        expect(optionIds).toContain('breathe');
        expect(optionIds).toContain('quote');
      });
    });

    it('should include "grounding" for anxious and stressed moods', () => {
      const anxiousOptions = getWaitingOptions('anxious');
      const stressedOptions = getWaitingOptions('stressed');
      const angryOptions = getWaitingOptions('angry');
      const overwhelmedOptions = getWaitingOptions('overwhelmed');

      expect(anxiousOptions.map(o => o.id)).toContain('grounding');
      expect(stressedOptions.map(o => o.id)).toContain('grounding');
      expect(angryOptions.map(o => o.id)).toContain('grounding');
      expect(overwhelmedOptions.map(o => o.id)).toContain('grounding');
    });

    it('should NOT include "grounding" for sad or lonely moods', () => {
      const sadOptions = getWaitingOptions('sad');
      const lonelyOptions = getWaitingOptions('lonely');

      expect(sadOptions.map(o => o.id)).not.toContain('grounding');
      expect(lonelyOptions.map(o => o.id)).not.toContain('grounding');
    });

    it('should include "video" for all moods', () => {
      const sadOptions = getWaitingOptions('sad');
      const anxiousOptions = getWaitingOptions('anxious');
      const neutralOptions = getWaitingOptions('neutral');

      expect(sadOptions.map(o => o.id)).toContain('video');
      expect(anxiousOptions.map(o => o.id)).toContain('video');
      expect(neutralOptions.map(o => o.id)).toContain('video');
    });
    
  });
});
