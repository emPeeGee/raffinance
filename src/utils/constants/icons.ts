import { FunctionComponent } from 'react';

import {
  IconApple,
  IconBeer,
  IconCoins,
  IconRocket,
  IconActivity,
  TablerIconsProps,
  IconAdjustmentsHorizontal,
  IconAirBalloon,
  IconAlertCircle,
  IconAnchor,
  IconArmchair,
  IconAsset,
  IconAward,
  IconBabyBottle,
  IconBalloon,
  IconBaguette,
  IconBandage,
  IconBarbell,
  IconBat,
  IconBattery2,
  IconBasket,
  IconBell,
  IconBible,
  IconBook,
  IconBone,
  IconBookmark,
  IconBrain,
  IconBus,
  IconCactus,
  IconCake,
  IconCalculator,
  IconCampfire,
  IconCarrot,
  IconChargingPile,
  IconCheese,
  IconClock,
  IconCloud,
  IconCrown,
  IconCookie,
  IconCup,
  IconCut,
  IconDental,
  IconDeviceMobile,
  IconDeviceAirpods,
  IconDeviceTv,
  IconDeviceWatch,
  IconCat,
  IconDroplet,
  IconEgg,
  IconEye,
  IconFish,
  IconFlask,
  IconFountain,
  IconFriends,
  IconGavel,
  IconGift,
  IconHeart,
  IconHome,
  IconMap,
  IconDog,
  IconLeaf
} from '@tabler/icons-react';

export interface Icon {
  label: string;
  value: string;
  component: FunctionComponent<TablerIconsProps>;
}

// TODO: expand
// IDEA: I could group them by something
export const ICONS: Icon[] = [
  { value: 'rocket', label: 'Rocket', component: IconRocket },
  { value: 'coins', label: 'Coins', component: IconCoins },
  { value: 'apple', label: 'Apple', component: IconApple },
  { value: 'activity', label: 'Activity', component: IconActivity },
  { value: 'adjustments', label: 'Adjustments', component: IconAdjustmentsHorizontal },
  { value: 'air-balloon', label: 'Air-balloon', component: IconAirBalloon },
  { value: 'alert', label: 'Alert', component: IconAlertCircle },
  { value: 'anchor', label: 'Anchor', component: IconAnchor },
  { value: 'armchair', label: 'Armchair', component: IconArmchair },
  { value: 'asset', label: 'Asset', component: IconAsset },
  { value: 'award', label: 'Award', component: IconAward },
  { value: 'baby', label: 'Baby Bottle', component: IconBabyBottle },
  { value: 'balloon', label: 'Balloon', component: IconBalloon },
  { value: 'baguette', label: 'Baguette', component: IconBaguette },
  { value: 'bandage', label: 'Bandage', component: IconBandage },
  { value: 'barbell', label: 'Barbell', component: IconBarbell },
  { value: 'bat', label: 'Bat', component: IconBat },
  { value: 'battery', label: 'Battery', component: IconBattery2 },
  { value: 'basket', label: 'Basket', component: IconBasket },
  { value: 'beer', label: 'Beer', component: IconBeer },
  { value: 'bell', label: 'Bell', component: IconBell },
  { value: 'bible', label: 'Bible', component: IconBible },
  { value: 'book', label: 'Book', component: IconBook },
  { value: 'bone', label: 'Bone', component: IconBone },
  { value: 'bookmark', label: 'Bookmark', component: IconBookmark },
  { value: 'brain', label: 'Brain', component: IconBrain },
  { value: 'bus', label: 'Bus', component: IconBus },
  { value: 'cactus', label: 'Cactus', component: IconCactus },
  { value: 'cake', label: 'Cake', component: IconCake },
  { value: 'cat', label: 'Cat', component: IconCat },
  { value: 'calculator', label: 'Calculator', component: IconCalculator },
  { value: 'campfire', label: 'Campfire', component: IconCampfire },
  { value: 'carrot', label: 'Carrot', component: IconCarrot },
  { value: 'charging', label: 'Charging pile', component: IconChargingPile },
  { value: 'cheese', label: 'Cheese', component: IconCheese },
  { value: 'clock', label: 'Clock', component: IconClock },
  { value: 'cloud', label: 'Cloud', component: IconCloud },
  { value: 'cookie', label: 'Cookie', component: IconCookie },
  { value: 'crown', label: 'Crown', component: IconCrown },
  { value: 'cup', label: 'Cup', component: IconCup },
  { value: 'cut', label: 'Cut', component: IconCut },
  { value: 'dendal', label: 'Dendal', component: IconDental },
  { value: 'mobile', label: 'Mobile', component: IconDeviceMobile },
  { value: 'airpods', label: 'Airpods', component: IconDeviceAirpods },
  { value: 'tv', label: 'TV', component: IconDeviceTv },
  { value: 'watch', label: 'Watch', component: IconDeviceWatch },
  { value: 'dog', label: 'Dog', component: IconDog },
  { value: 'droplet', label: 'Droplet', component: IconDroplet },
  { value: 'egg', label: 'Egg', component: IconEgg },
  { value: 'eye', label: 'Eye', component: IconEye },
  { value: 'fish', label: 'Fish', component: IconFish },
  { value: 'flask', label: 'Flask', component: IconFlask },
  { value: 'fountain', label: 'Fountain', component: IconFountain },
  { value: 'friends', label: 'Friends', component: IconFriends },
  { value: 'gavel', label: 'Gavel', component: IconGavel },
  { value: 'gift', label: 'Gift', component: IconGift },
  { value: 'heart', label: 'Heart', component: IconHeart },
  { value: 'home', label: 'Home', component: IconHome },
  { value: 'leaf', label: 'Leaf', component: IconLeaf },
  { value: 'map', label: 'Map', component: IconMap }
  // TODO: From M expand
];
