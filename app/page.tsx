import Link from 'next/link'
import { Sparkles, Star, Brain, Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getTotalFortuneCalls } from '@/api/stats'

export default async function Home() {
  const [session, totalFortuneCalls] = await Promise.all([auth(), getTotalFortuneCalls()])

  return (
    <div className="flex flex-col items-center w-full">

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-20 pb-24 max-w-4xl w-full">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3"/>
          AI 기반 운세 분석 플랫폼
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-tight sm:text-6xl lg:text-7xl">
          알고리즘과<br/>
          <span className="bg-gradient-to-br from-white via-white/70 to-white/30 bg-clip-text text-transparent">
            사주의 만남
          </span>
        </h1>
        <p className="mt-6 text-base text-muted-foreground max-w-xl leading-relaxed">
          태어난 순간, 우주는 이미 답을 알고 있었다.<br/>
          그 비밀을 알고리즘으로 풀어냅니다.
        </p>
        {totalFortuneCalls !== null && (
          <p className="mt-8 text-sm text-white/60">
            지금까지{' '}
            <span className="font-bold text-white text-base">{totalFortuneCalls.toLocaleString('ko-KR')}</span>
            {' '}명이 운세를 분석했어요!
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href={session ? '/category' : '/login'}>지금 시작하기</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-white/40">
          매일 3회 무료 제공
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-4xl">
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"/>
      </div>

      {/* Features */}
      <section id="features" className="w-full max-w-4xl py-20 max-lg:pb-10">
        <h2 className="text-center text-2xl font-bold mb-12">왜 <u>&#34;{process.env.NEXT_PUBLIC_APP_NAME}&#34;</u> 인가</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <Brain className="h-6 w-6 mb-4"/>
            <h3 className="font-semibold mb-2">알고리즘 기반 해석</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              전통 사주 이론에 현대 알고리즘을 결합해 객관적이고 체계적인 해석을 제공합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <Star className="h-6 w-6 mb-4"/>
            <h3 className="font-semibold mb-2">다양한 카테고리와 템플릿</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              복잡한 프롬프트 없이, 주제별 템플릿을 선택하는 것만으로 연애운·재물운 등 원하는 운세를 바로 확인하세요.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <Users className="h-6 w-6 mb-4"/>
            <h3 className="font-semibold mb-2">다중 프로필 관리</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              가족과 지인의 사주를 저장하고, 언제든 조회하거나 서로의 궁합까지 확인해보세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
