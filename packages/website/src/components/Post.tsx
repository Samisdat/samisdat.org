import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';
import { Heading } from '@samisdat/ui-components/Heading';

const PostStyled = styled.main`
    width: min(100%, 80ch);
    margin: 0 auto;
`;

export type PostProps = HTMLAttributes<HTMLDivElement> & {};
export const Post: FC<PostProps> = ({ children, ...props }) => {
    return (
        <PostStyled {...props}>
            <header>
                <Heading level={1}>
                    0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000 0000000000
                    Color Shifting in CSS An Exploration of Color Animation Techniques
                </Heading>
                <time dateTime="2025-10-10">10. Oktober 2025</time>
            </header>
            <article>
                <p>
                    It&#x27;s often said that the internet has democratized education: the sum of human knowledge is
                    only a Google search away! And yet, having access to information is only half of the story; you also
                    need to be able to convert raw information into usable skills.
                </p>
                <p>
                    For a lot of us, the gap between the two can lead to things like <em>tutorial hell</em>—getting
                    stuck doing tutorial after tutorial without ever feeling like you&#x27;re making substantive
                    progress.
                </p>
                <p>
                    Learning how to learn effectively is super important, <i>especially</i> as a software developer;
                    learning new things is practically the whole gig! If you can learn to quickly pick up new
                    languages/frameworks/tools, you&#x27;ll be able to be <i>way more productive</i> than the average
                    developer. It&#x27;s sort of a superpower.
                </p>
                <p>
                    In this blog post, I&#x27;ll share what I&#x27;ve learned about learning, and show you how I pick up
                    new skills lickety-split!
                </p>
                <h2> Mixing guided and unguided learning</h2>
                <p>Broadly speaking, there are two categories of learning:</p>
                <ol>
                    <li>
                        <div>
                            <strong>Guided:</strong> Reading a tutorial, taking a course, watching a YouTube video.
                            Anything where you&#x27;re following a guide.
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Unguided:</strong> Creating your own projects from scratch, extending a tutorial,
                            looking things up in the docs. Anything where you aren&#x27;t following a guide.
                        </div>
                    </li>
                </ol>
                <p>
                    If you only follow guided resources, you&#x27;ll wind up in <em>tutorial hell</em>. You won&#x27;t
                    develop the problem-solving skills needed to succeed as a developer. When you try to build your own
                    project, you won&#x27;t know where to start. It will feel like you&#x27;ve spent so much time
                    practicing without developing any tangible, practical skills.
                </p>
                <p>
                    On the other hand, if you focus entirely on unguided learning, it&#x27;ll take
                    <i>forever</i>. Without an experienced guide, you&#x27;ll need to reinvent every wheel, spending
                    days or weeks solving already-solved problems. This is a long and frustrating road. In the worst
                    case, you might wind up quitting altogether, convinced (incorrectly!) that you just aren&#x27;t
                    smart enough for this stuff.
                </p>
                <p>
                    Some courses are aware of this dichotomy, and will include opportunities for unguided learning.
                    Things like stretch goals, thought experiments, and challenging exercises. I wish these types of
                    resources were more common!
                </p>
                <p>Let&#x27;s look at some ideas for how to mix some unguided learning into guided resources.</p>
                <h3>Making intentional mistakes</h3>
                <p>
                    If you&#x27;re anything like me, you don&#x27;t like making mistakes. You want everything to go
                    perfectly, the very first time.
                </p>
                <p>
                    This mindset is generally helpful in life, and it&#x27;s helpful in other fields. If you work as an
                    auto mechanic, mistakes can cost hundreds of dollars in parts. If you work as a dentist, a mistake
                    might ruin someone&#x27;s smile.
                </p>
                <p>
                    With software development, though, mistakes are free! If we make a mistake, we can tab back to our
                    editor, change the code, and try again. We even have helpful error messages that can (sometimes)
                    point us in the right direction. This is an incredible luxury, and not one that we take advantage of
                    enough.
                </p>
                <p>
                    When I follow a tutorial, I like to play with the code. Instead of copy/pasting the provided code
                    verbatim, try experimenting with it: what happens if you omit one of the lines? Or if you change
                    some of the values?
                </p>
                <p>
                    I try and act like a scientist. If I have a hypothesis about how this code is supposed to work, I
                    test that hypothesis by changing the code, and seeing if it breaks in the way I expect. When I
                    discover that my hypothesis is flawed, I might detour from the tutorial and do some research on
                    Google. Or I might add it to a list of &quot;things to explore later&quot;, if the rabbit hole seems
                    to go too deep.
                </p>
                <p>
                    This process helps us avoid the sinister rhythm of following a tutorial on autopilot, copy/pasting
                    code without really understanding what it does or why we&#x27;re doing it.
                </p>
                <p>
                    Learning is an active process. Poking and prodding at the code will help us build a mental model for
                    what&#x27;s going on.
                </p>
                <aside>
                    <strong>The tutorial fade</strong>
                    <p>
                        Years ago, when I was just starting out, I used a process I call &quot;the tutorial fade&quot;.
                    </p>
                    <p>Here&#x27;s how it works:</p>
                    <ol>
                        <li>
                            <div>Follow a tutorial verbatim, going through it step by step.</div>
                        </li>
                        <li>
                            <div>
                                When you&#x27;ve finished, reset the code to the initial state, and minimize the
                                tutorial. See how far you can get <strong>without looking at the tutorial</strong>. When
                                you get stuck, pull the tutorial back up, but minimize it again once you&#x27;ve
                                unblocked yourself.
                            </div>
                        </li>
                        <li>
                            <div>
                                Repeat this process until you can complete the tutorial start-to-finish without looking
                                at the instructions.
                            </div>
                        </li>
                    </ol>
                    <p>
                        Like the scientist mindset described above, this process is useful because it forces you to pay
                        attention. The tutorial fades away, and you wind up learning how to build the thing without
                        guidance.
                    </p>
                    <p>
                        This method is super effective, but not everyone enjoys building the same thing over and over.
                        If you&#x27;ve struggled to escape from Tutorial Hell, though, it might be worth a shot!
                    </p>
                </aside>
                <h3> Extending tutorials</h3>
                <p>
                    Let&#x27;s suppose we&#x27;re learning React by building a tic-tac-toe game, following the{' '}
                    <a href="https://react.dev/learn/tutorial-tic-tac-toe">official tutorial</a>.
                </p>
                <p>
                    By the time you&#x27;ve finished the tutorial, you will have created a fully-functional yet
                    pretty-minimal game.
                </p>
                <div>
                    <video src="/tic-tac-toe.mp4"></video>
                </div>
                <p>There are all kinds of fun bells and whistles we can add to it:</p>
                <ul>
                    <li>Keep track of how many games each player has won</li>
                    <li>Enhance the UI with more presentational components</li>
                    <li>Allow the board size to be configured (4x4, 5x5)</li>
                    <li>Add an AI that the player can play against</li>
                    <li>Whimsy! (animations, sound effects, confetti on victory, etc)</li>
                </ul>
                <p>Be creative, and pick things you&#x27;re genuinely interested in!</p>
                <p>
                    This strategy is nice because you avoid the stress of a blank canvas. You already have a
                    fully-functional, well-understood project. You&#x27;re adding bricks to a solid foundation.
                </p>
                <p>
                    It also has a nice side-benefit: if you add significant extensions to a tutorial project, you can
                    take credit for it in your portfolio! I cover this strategy in depth in my book,{' '}
                    <a href="https://www.joshwcomeau.com/effective-portfolio/">Building an Effective Dev Portfolio</a>.
                </p>
                <h3>Building related projects</h3>
                <p>
                    Once you&#x27;ve finished the tic-tac-toe project, you might be a little unsure about what to do
                    next.
                </p>
                <p>
                    Before hopping onto another tutorial, it might be a good idea to try building a similar project from
                    scratch.
                </p>
                <p>
                    For example, maybe you can make a bingo game! You&#x27;ll be able to leverage some of your new
                    skills (state management, event listening), but in a slightly different context. You&#x27;ll likely
                    hit a point where you don&#x27;t know how to do something, because it wasn&#x27;t covered in the
                    tutorial; you can do some sleuthing on Google to try and find a solution!
                </p>
                <p>
                    If you really can&#x27;t crack it, you can set this project aside for now. Do a few more tutorials,
                    and then check back later to see if you&#x27;ve learned enough to unblock yourself.
                </p>
                <p>
                    I&#x27;ve seen this strategy described as &quot;one on, one off&quot;. Follow a guided resource like
                    a tutorial, and then spend an equal amount of time creating a similar (but unguided) project. If the
                    tutorial shows you how to build an Instagram clone, try building a Bluesky clone on your own!
                </p>
                <aside>
                    <strong>Finding the right balance</strong>
                    <p>
                        When I&#x27;m at the very beginning of a learning journey, I tend to focus primarily on guided
                        learning. It&#x27;s difficult to build anything in an unguided way when I&#x27;m still grappling
                        with the syntax and the fundamentals!
                    </p>
                    <p>
                        As I become more comfortable, though, the balance shifts. I spend more and more of my time on
                        unguided learning, building things that seem interesting to me. I&#x27;ll seek out tutorials
                        when I encounter new and unfamiliar problems, but that becomes less and less common as I gain
                        more experience.
                    </p>
                    <p>My graph looks something like this:</p>
                    <img
                        style={{ width: '300px' }}
                        src="/guided-graph.webp"
                    />

                    <p>
                        Your graph might look a bit different; ultimately, it&#x27;s up to you to find the right
                        balance! The important thing is that we don&#x27;t focus exclusively on guided or unguided
                        learning.
                    </p>
                </aside>
                <h2>Mindset cultivation</h2>
                <p>Many years ago, I went bowling with some friends.</p>
                <p>
                    I didn&#x27;t do well. Most of my balls wound up in the gutter. By the end of the game, I had the
                    lowest score out of the group by far.
                </p>
                <p>There are two different ways to interpret this scenario:</p>
                <ol>
                    <li>
                        <div>
                            I&#x27;m just not good at bowling, and I never will be. Bowling just isn&#x27;t my thing.
                        </div>
                    </li>
                    <li>
                        <div>I&#x27;m not good at bowling. If I want to, though, I can become an excellent bowler.</div>
                    </li>
                </ol>
                <p>
                    There is a self-fulfilling prophecy aspect to this: whichever interpretation you choose will be
                    correct. If you think that your level of bowling skill is fixed, it will be. If you believe that you
                    can improve, you will! *
                    <span>
                        This isn&#x27;t to say that everyone starts from the same place; I do believe that natural
                        ability exists! But all of us have the potential to improve tremendously
                    </span>
                </p>
            </article>
        </PostStyled>
    );
};
