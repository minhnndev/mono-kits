import {
    SwitchLanguage
} from '@momo-kits/core';

module.exports = {
    solar: {
        1: [
            {
                day: 1,
                month: 1,
                label: SwitchLanguage.newYear
            }
        ],
        2: [
            {
                day: 14,
                month: 2,
                label: SwitchLanguage.valentine
            }
        ],
        3: [
            {
                day: 8,
                month: 3,
                label: SwitchLanguage.womenDay
            }
        ],
        4: [
            {
                day: 30,
                month: 4,
                label: SwitchLanguage.liberationDay
            }
        ],
        5: [
            {
                day: 1,
                month: 5,
                label: SwitchLanguage.laborDay
            }
        ],
        6: [
            {
                day: 1,
                month: 6,
                label: SwitchLanguage.childrenDay
            }
        ],
        9: [
            {
                day: 2,
                month: 9,
                label: SwitchLanguage.nationalDay
            }
        ],
        10: [
            {
                day: 20,
                month: 10,
                label: SwitchLanguage.womenDayVN
            }
        ],
        11: [
            {
                day: 20,
                month: 11,
                label: SwitchLanguage.teacherDay
            }
        ],
        12: [
            {
                day: 24,
                month: 12,
                label: SwitchLanguage.christmasEve
            },
            {
                day: 25,
                month: 12,
                label: SwitchLanguage.christmas
            }
        ]
    },
    lunar: [
        {
            lunarDay: 30,
            lunarMonth: 12,
            lunar: true,
            label: SwitchLanguage.lunarNewYear,
            highlight: '(30/12)'
        },
        {
            lunarDay: 1,
            lunarMonth: 1,
            lunar: true,
            label: SwitchLanguage.lunarNewYear,
            highlight: '(1/1)'
        },
        {
            lunarDay: 2,
            lunarMonth: 1,
            lunar: true,
            label: SwitchLanguage.lunarNewYear,
            highlight: '(2/1)'
        },
        {
            lunarDay: 3,
            lunarMonth: 1,
            lunar: true,
            label: SwitchLanguage.lunarNewYear,
            highlight: '(3/1)'
        },
        {
            lunarDay: 4,
            lunarMonth: 1,
            lunar: true,
            label: SwitchLanguage.lunarNewYear,
            highlight: '(4/1)'
        },
        {
            lunarDay: 10,
            lunarMonth: 3,
            lunar: true,
            label: SwitchLanguage.hungKingDay,
            highlight: '(10/3)'
        }
    ]
};
