# 🎪 Kid's Deal or No Deal Game

A fun, interactive, kid-friendly version of the famous "Deal or No Deal" TV game show. Built with React, TypeScript, and Framer Motion for smooth animations.

## 🌟 Features

### Core Gameplay
- **7 Suitcases** instead of 26 for quick gameplay (5-10 minutes per kid)
- **Spinning Wheel** for fair kid selection with confetti celebrations
- **Boy & Girl Themes** with customized rewards (20+ rewards each)
- **Activities vs Rewards** - Left panel shows activities, right panel shows rewards
- **Banker Offers** - Appears after 3rd and 5th case with activity offers
- **Swap Option** - When only 2 cases remain, swap your case or keep it
- **Final Reveal** with celebration animations

### Kid Management
- Add up to 12 kids to play
- Spinning wheel automatically removes kids after they play
- LocalStorage persistence - saves kid names between sessions
- "Next Kid" button for quick transitions
- "Play Another Round" to reset all kids

### Visual Features
- Beautiful gradient backgrounds
- Smooth animations with Framer Motion
- Confetti celebrations for rewards
- Kid-friendly colors and fonts
- Responsive design for mobile, tablet, and desktop
- Touch-friendly buttons (44px minimum)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd deal-no-deal-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

### 1. Kid Setup
- Add names of all kids who want to play
- Names are saved automatically

### 2. Spinning Wheel
- Click "SPIN THE WHEEL" to select the next player
- Watch the wheel spin with excitement!
- Confetti pops when a kid is selected

### 3. Choose Theme
- Select Boy's Game or Girl's Game
- Each theme has different rewards

### 4. Pick Your Case
- Choose 1 suitcase out of 7
- This will be YOUR case for the entire game

### 5. Open Cases
- Open the other 6 cases one by one
- Watch items get crossed off the panels
- **Banker appears after 3rd case** - First offer!
- **Banker appears after 5th case** - Final offer!
- Accept the banker's activity offer or decline

### 6. Swap Offer
- When 2 cases remain, you get one last choice
- Swap your case or keep it?
- This is the classic Deal or No Deal moment!

### 7. Final Reveal
- Your case opens with drumroll
- Confetti if you won a reward!
- Activity assignment if you got a task

### 8. Next Player
- "Spin for Next Kid" to continue
- Game tracks who has played
- When everyone finishes, "Play Another Round"

## 📊 Game Data

### Activities (20 Total - Same for Both Themes)
- Do jumping jacks
- Read for 15 minutes
- Help with dishes
- Clean your room
- Walk the dog
- Complete homework
- And 14 more...

### Boy Theme Rewards (20 Total)
- Roblox gift card
- LEGO set
- Video game
- Nerf gun set
- Basketball with dad
- And 15 more...

### Girl Theme Rewards (20 Total)
- Pendant necklace
- Art supplies kit
- Sleepover pass
- Nail polish set
- Theater tickets
- And 15 more...

**Note:** Each game randomly selects 7 activities and 7 rewards from these large lists, making every game unique!

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **canvas-confetti** - Celebration effects
- **Context API** - State management
- **LocalStorage** - Data persistence

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── KidNameSetup.tsx
│   ├── SpinningWheel.tsx
│   ├── ThemeSelector.tsx
│   ├── GameBoard.tsx
│   ├── Suitcase.tsx
│   ├── ItemsPanel.tsx
│   ├── BankerOffer.tsx
│   ├── SwapOffer.tsx
│   └── GameResult.tsx
├── context/          # State management
│   ├── GameContext.tsx
│   └── KidContext.tsx
├── data/             # Game data
│   ├── activities.ts
│   ├── boyTheme.ts
│   └── girlTheme.ts
├── types/            # TypeScript types
│   ├── game.types.ts
│   ├── kid.types.ts
│   └── theme.types.ts
├── utils/            # Utility functions
│   ├── randomSelection.ts
│   ├── storage.ts
│   └── wheelPhysics.ts
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🎨 Customization

### Adding New Rewards
Edit `src/data/boyTheme.ts` or `src/data/girlTheme.ts`:

```typescript
export const BOY_REWARDS = [
  '🎮 Your new reward here',
  // ... add more
];
```

### Adding New Activities
Edit `src/data/activities.ts`:

```typescript
export const ACTIVITIES = [
  '🏃 Your new activity here',
  // ... add more
];
```

### Changing Number of Suitcases
Currently set to 7. To change, modify:
- `GameContext.tsx` - Line 72: `{ length: 7 }`
- Banker trigger logic (lines 117, 121)
- Update PLAN.md documentation

### Theme Colors
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    blue: '#3B82F6',
    pink: '#EC4899',
    // ... modify colors
  },
},
```

## 🐛 Known Limitations

- Sound effects not yet implemented (placeholder for future)
- No background music (can be added)
- Wheel spinning uses pseudo-random selection (fair but predictable with seed)
- LocalStorage has 24-hour expiry

## 🚧 Future Enhancements

See PLAN.md for comprehensive list, including:
- Sound effects integration
- Custom reward/activity editor
- Photo upload for kids
- Statistics dashboard
- Printable certificates
- Multi-language support
- Parent admin panel

## 📝 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Original concept: "Deal or No Deal" TV show
- Icons: Emoji system fonts
- Fonts: Google Fonts (Fredoka One, Poppins, Orbitron)

## 🎯 Target Audience

- **Age Range**: 6-12 years old
- **Play Time**: 5-10 minutes per kid
- **Max Players**: 12 kids
- **Device**: Works on mobile, tablet (recommended), and desktop

## 💡 Tips for Parents

1. **First Time Setup**: Add all kid names before starting
2. **Fair Play**: The wheel is truly random - everyone gets equal chances
3. **Activities**: Review activities list and customize for your family
4. **Rewards**: Adjust rewards based on what motivates your kids
5. **Screen Time**: Consider this as quality family interaction time
6. **Learning**: Use the game to teach decision-making and probability

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for kids and families!** 🎉
